import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

actor {
  include MixinStorage();

  type User = Principal;
  type SessionId = Text;
  type ImageId = Nat;

  public type Emotion = {
    #happy;
    #sad;
    #angry;
    #surprised;
    #neutral;
  };

  public type CartoonStyle = {
    #comicBook;
    #anime;
    #pixelArt;
    #watercolor;
    #popArt;
  };

  public type TransformationRequest = {
    emotion : ?Emotion;
    cartoonStyle : ?CartoonStyle;
  };

  public type ImageData = {
    id : ImageId;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  public type TransformationResult = {
    originalImage : ImageData;
    emotionTransformed : ?ImageData;
    cartoonTransformed : ?ImageData;
  };

  module Session {
    public type Session = {
      id : SessionId;
      user : User;
      requests : [TransformationRequest];
      results : [TransformationResult];
    };

    public func compare(session1 : Session, session2 : Session) : Order.Order {
      Text.compare(session1.id, session2.id);
    };
  };

  var nextImageId = 0;
  var nextSessionId = 0;

  let sessions = Map.empty<SessionId, Session.Session>();

  public shared ({ caller }) func startSession() : async SessionId {
    let sessionId = "session_" # nextSessionId.toText();
    sessions.add(
      sessionId,
      {
        id = sessionId;
        user = caller;
        requests = [];
        results = [];
      },
    );
    nextSessionId += 1;
    sessionId;
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async Session.Session {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) { session };
    };
  };

  public query ({ caller }) func getAllSessions() : async [Session.Session] {
    sessions.values().toArray().sort();
  };

  public shared ({ caller }) func uploadImage(
    sessionId : SessionId,
    blob : Storage.ExternalBlob,
    name : Text,
  ) : async ImageData {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?_) {
        let imageData : ImageData = {
          id = nextImageId;
          blob;
          name;
        };
        nextImageId += 1;
        imageData;
      };
    };
  };

  public shared ({ caller }) func requestTransformation(
    sessionId : SessionId,
    emotion : ?Emotion,
    cartoonStyle : ?CartoonStyle,
  ) : async () {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let request : TransformationRequest = {
          emotion;
          cartoonStyle;
        };
        let updatedRequests = [request];
        let updatedSession : Session.Session = {
          id = session.id;
          user = session.user;
          requests = updatedRequests;
          results = session.results;
        };
        sessions.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func saveTransformationResult(
    sessionId : SessionId,
    originalImage : ImageData,
    emotionTransformed : ?ImageData,
    cartoonTransformed : ?ImageData,
  ) : async () {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let result : TransformationResult = {
          originalImage;
          emotionTransformed;
          cartoonTransformed;
        };
        let updatedResults = [result].concat(session.results);
        let updatedSession : Session.Session = {
          id = session.id;
          user = session.user;
          requests = session.requests;
          results = updatedResults;
        };
        sessions.add(sessionId, updatedSession);
      };
    };
  };
};

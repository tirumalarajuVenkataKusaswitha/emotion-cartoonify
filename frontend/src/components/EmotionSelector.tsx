import { Emotion } from '../backend';
import { Card } from '@/components/ui/card';

interface EmotionSelectorProps {
  selected: Emotion | null;
  onSelect: (emotion: Emotion) => void;
  disabled?: boolean;
}

const emotions: Array<{ value: Emotion; label: string; icon: string }> = [
  { value: 'happy' as Emotion, label: 'Happy', icon: '/assets/generated/emotion-happy.dim_64x64.png' },
  { value: 'sad' as Emotion, label: 'Sad', icon: '/assets/generated/emotion-sad.dim_64x64.png' },
  { value: 'surprised' as Emotion, label: 'Surprised', icon: '/assets/generated/emotion-surprised.dim_64x64.png' },
  { value: 'angry' as Emotion, label: 'Angry', icon: '/assets/generated/emotion-angry.dim_64x64.png' },
  { value: 'neutral' as Emotion, label: 'Neutral', icon: '/assets/generated/emotion-neutral.dim_64x64.png' },
];

export function EmotionSelector({ selected, onSelect, disabled }: EmotionSelectorProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">Choose Emotion</h2>
          <p className="text-sm text-muted-foreground">Select the emotion you want to apply</p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {emotions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => onSelect(emotion.value)}
              disabled={disabled}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selected === emotion.value
                  ? 'border-primary bg-primary/10 shadow-warm'
                  : 'border-border hover:border-primary/50 bg-card'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <img src={emotion.icon} alt={emotion.label} className="w-12 h-12" />
              <span className="text-sm font-medium text-foreground">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

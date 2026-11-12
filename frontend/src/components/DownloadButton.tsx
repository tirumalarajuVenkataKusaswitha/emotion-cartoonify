import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageData } from '../backend';
import { useState } from 'react';

interface DownloadButtonProps {
  imageData: ImageData;
}

export function DownloadButton({ imageData }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const bytes = await imageData.blob.getBytes();
      const blob = new Blob([bytes], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotion-cartoon-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isDownloading} size="lg" className="gap-2">
      <Download className="w-4 h-4" />
      {isDownloading ? 'Downloading...' : 'Download Result'}
    </Button>
  );
}

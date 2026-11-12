import { CartoonStyle } from '../backend';
import { Card } from '@/components/ui/card';

interface CartoonStyleSelectorProps {
  selected: CartoonStyle | null;
  onSelect: (style: CartoonStyle) => void;
  disabled?: boolean;
}

const styles: Array<{ value: CartoonStyle; label: string; description: string }> = [
  { value: 'anime' as CartoonStyle, label: 'Ghibli Style', description: 'Soft, hand-drawn anime aesthetic' },
  { value: 'comicBook' as CartoonStyle, label: 'Comic Book', description: 'Bold lines and vibrant colors' },
  { value: 'pixelArt' as CartoonStyle, label: 'Pixel Art', description: 'Retro 8-bit style' },
  { value: 'watercolor' as CartoonStyle, label: 'Watercolor', description: 'Soft, painted look' },
  { value: 'popArt' as CartoonStyle, label: 'Pop Art', description: 'Bold, graphic style' },
];

export function CartoonStyleSelector({ selected, onSelect, disabled }: CartoonStyleSelectorProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground mb-2">Choose Cartoon Style</h2>
          <p className="text-sm text-muted-foreground">Select the artistic style for your transformation</p>
        </div>

        {/* Featured Ghibli example */}
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <img
            src="/assets/generated/ghibli-example.dim_800x600.png"
            alt="Ghibli style example"
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <p className="text-xs text-muted-foreground text-center">Example of Ghibli-style transformation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => onSelect(style.value)}
              disabled={disabled}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all text-left ${
                selected === style.value
                  ? 'border-primary bg-primary/10 shadow-warm'
                  : 'border-border hover:border-primary/50 bg-card'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="text-base font-semibold text-foreground">{style.label}</span>
              <span className="text-xs text-muted-foreground">{style.description}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

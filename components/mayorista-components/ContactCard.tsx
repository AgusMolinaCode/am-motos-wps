import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ContactCard() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-foreground font-bold mb-2">¿Necesitas ayuda?</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Tu ejecutivo de cuenta está disponible para asistirte con pedidos especiales.
        </p>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
            AM
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">Andrés Martínez</p>
            <p className="text-muted-foreground text-xs">Ejecutivo Mayoristas</p>
          </div>
        </div>
        <Button className="w-full mt-4 bg-muted hover:bg-muted/80 text-foreground">
          Contactar
        </Button>
      </CardContent>
    </Card>
  );
}

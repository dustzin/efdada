import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Phone, Utensils, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Utensils className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Restaurante El Buen Sabor
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Una experiencia gastronómica única con los mejores sabores tradicionales en un ambiente acogedor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservar">
              <Button size="lg" className="text-lg px-8">
                <CalendarDays className="mr-2 h-5 w-5" />
                Hacer Reservación
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Settings className="mr-2 h-5 w-5" />
                Panel Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Información del Restaurante</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Horario</CardTitle>
                <CardDescription>Nuestros horarios de atención</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Lunes - Viernes</span>
                  <span className="font-medium">12:00 - 22:00</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Sábado - Domingo</span>
                  <span className="font-medium">11:00 - 23:00</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Ubicación</CardTitle>
                <CardDescription>Encuéntranos fácilmente</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Av. Principal #123<br />
                  Col. Centro, Ciudad<br />
                  CP 12345
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Contacto</CardTitle>
                <CardDescription>Comunícate con nosotros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">Tel: (555) 123-4567</p>
                <p className="text-muted-foreground">contacto@elbuensabor.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2026 Restaurante El Buen Sabor - Proyecto Escolar</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

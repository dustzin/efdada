import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useReservations } from "@/hooks/useReservations";
import { TIME_SLOTS, GUEST_OPTIONS } from "@/types/reservation";
import { CalendarIcon, CheckCircle, Home, Users, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const reservationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  contact: z.string().min(5, "Ingresa un teléfono o email válido").max(100),
  date: z.date({ required_error: "Selecciona una fecha" }),
  time: z.string({ required_error: "Selecciona un horario" }),
  guests: z.string({ required_error: "Selecciona el número de personas" }),
  comments: z.string().max(500).optional(),
});

type ReservationForm = z.infer<typeof reservationSchema>;

const Reservation = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { addReservation, getAvailableSlots } = useReservations();

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      contact: "",
      comments: "",
    },
  });

  const selectedDate = form.watch("date");
  const availableSlots = selectedDate
    ? getAvailableSlots(format(selectedDate, "yyyy-MM-dd"), TIME_SLOTS)
    : TIME_SLOTS;

  const onSubmit = (data: ReservationForm) => {
    addReservation({
      name: data.name,
      contact: data.contact,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      guests: parseInt(data.guests),
      comments: data.comments,
    });
    setIsSuccess(true);
    toast({
      title: "¡Reservación enviada!",
      description: "Te contactaremos pronto para confirmar.",
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">¡Reservación Enviada!</CardTitle>
            <CardDescription className="text-base">
              Tu solicitud ha sido recibida. Te contactaremos pronto para confirmar tu reservación.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}>
              Hacer otra reservación
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reservar Mesa</h1>
          <p className="text-muted-foreground">Completa el formulario para solicitar tu reservación</p>
          <Link to="/" className="inline-flex items-center text-primary hover:underline mt-2">
            <Home className="mr-1 h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos de la Reservación</CardTitle>
            <CardDescription>Todos los campos marcados son obligatorios</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contacto */}
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono o Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567 o tu@email.com" {...field} />
                      </FormControl>
                      <FormDescription>Para confirmar tu reservación</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Fecha *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Selecciona fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              locale={es}
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Hora *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona hora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSlots.length === 0 ? (
                              <SelectItem value="none" disabled>
                                Sin horarios disponibles
                              </SelectItem>
                            ) : (
                              availableSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Número de personas */}
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Número de personas *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="¿Cuántas personas?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GUEST_OPTIONS.map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "persona" : "personas"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comentarios */}
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comentarios (opcional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Alergias, celebraciones especiales, preferencias de mesa..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full">
                  Enviar Reservación
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reservation;

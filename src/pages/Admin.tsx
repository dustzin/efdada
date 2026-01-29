import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReservations } from "@/hooks/useReservations";
import { Reservation } from "@/types/reservation";
import { CalendarDays, Users, Clock, CheckCircle, XCircle, AlertCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { reservations, updateStatus, stats } = useReservations();

  const filteredReservations = reservations.filter(
    (r) => r.date === format(selectedDate, "yyyy-MM-dd")
  );

  const getStatusBadge = (status: Reservation["status"]) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: AlertCircle, label: "Pendiente" },
      confirmed: { variant: "default" as const, icon: CheckCircle, label: "Confirmada" },
      cancelled: { variant: "destructive" as const, icon: XCircle, label: "Cancelada" },
    };
    const { variant, icon: Icon, label } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona las reservaciones del restaurante</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reservaciones</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.confirmed}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Seleccionar Fecha</CardTitle>
              <CardDescription>Ver reservaciones por día</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={es}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </CardContent>
          </Card>

          {/* Reservations Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Reservaciones del {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
              </CardTitle>
              <CardDescription>
                {filteredReservations.length} reservación(es) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay reservaciones para esta fecha</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Personas</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">{reservation.time}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{reservation.name}</p>
                              <p className="text-sm text-muted-foreground">{reservation.contact}</p>
                            </div>
                          </TableCell>
                          <TableCell>{reservation.guests}</TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {reservation.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateStatus(reservation.id, "confirmed")}
                                  >
                                    Confirmar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateStatus(reservation.id, "cancelled")}
                                  >
                                    Cancelar
                                  </Button>
                                </>
                              )}
                              {reservation.status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStatus(reservation.id, "cancelled")}
                                >
                                  Cancelar
                                </Button>
                              )}
                              {reservation.status === "cancelled" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStatus(reservation.id, "pending")}
                                >
                                  Reactivar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;

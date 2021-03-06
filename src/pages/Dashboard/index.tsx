import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { isToday, format} from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import {
  Container,
  Header, 
  HeaderContent, 
  Profile, 
  Content, 
  Schedule, 
  NextAppointment, 
  Section,
  Appointment,
  Calendar,
} from './styles';
import {useAuth} from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';
import { FiClock, FiPower } from 'react-icons/fi';
import api from '../../services/api';
import { isAfter, parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatarURL: string;
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if(modifiers.available && !modifiers.disabled){
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {}, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data);
    })
  }, [currentMonth, user.id]);

  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      const appointmentsFormatted = response.data.map(a => {
        return {
          ...a,
          hourFormatted: format(parseISO(a.date), 'HH:mm')
        }
      })

      setAppointments(appointmentsFormatted);
    })
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
    .filter(monthDay => monthDay.available === false)
    .map(monthDay => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      return new Date(year, month, monthDay.day);
    });

    return dates;
  }, [currentMonth, monthAvailability]);
  
  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMM", {locale: ptBr})
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc", {locale: ptBr})
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(a => {
      return parseISO(a.date).getHours() < 12;
    });
  },[appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(a => {
      return parseISO(a.date).getHours() >= 12;
    });
  },[appointments]);


  const nextAppointment = useMemo(() => {
    return appointments.find(a => 
        isAfter(parseISO(a.date), new Date())
      )
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src={user.avatarURL}
              alt={user.name}
            />

            <div>
              <span>Bem vindo,</span>
              <Link to="/profile"><strong>{user.name}</strong></Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Hor??rios agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatarURL}
                  alt={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          
          <Section>
            <strong>Manh??</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento</p>
            )}

            {morningAppointments.map((a) => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>

                <div>
                  <img
                    src={a.user.avatarURL}
                    alt={a.user.name}
                  />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointment>
            ))}
            
          </Section>
          
          
          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento</p>
            )}
            
            {afternoonAppointments.map((a) => (
              <Appointment key={a.id}>
                <span>
                  <FiClock />
                  {a.hourFormatted}
                </span>

                <div>
                  <img
                    src={a.user.avatarURL}
                    alt={a.user.name}
                  />
                  <strong>{a.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
      
        <Calendar>
          <DayPicker 
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[...disabledDays, { daysOfWeek: [0, 6] }]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] }
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Mar??o',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            />
        </Calendar>
      </Content>
    </Container>

  );
}
export default Dashboard;
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromDb, syncToDb } from './sync';
import {
  Role,
  ClientTab,
  AdminTab,
  ServiceItem,
  Appointment,
  Specialist,
  ClientProfile,
  StudioConfig,
  WaitlistEntry,
  FreedSlotEvent,
  WaitlistStatus,
  ClientNotificationPreferences,
  LoyaltyProfile,
  LoyaltyRewardCoupon,
  PointsTransaction,
  ServiceReview,
  ReviewStatus,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_APPOINTMENTS,
  INITIAL_SPECIALISTS,
  INITIAL_CLIENTS,
  INITIAL_STUDIO_CONFIG,
  INITIAL_WAITLIST,
  INITIAL_LOYALTY_PROFILE,
  AVAILABLE_REWARD_COUPONS,
  INITIAL_REVIEWS,
} from '../data/mockData';

interface StudioContextType {
  role: Role;
  setRole: (role: Role) => void;
  clientTab: ClientTab;
  setClientTab: (tab: ClientTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  viewportMode: 'responsive' | 'mobile_preview' | 'desktop_preview';
  setViewportMode: (mode: 'responsive' | 'mobile_preview' | 'desktop_preview') => void;
  selectedService: ServiceItem;
  setSelectedService: (service: ServiceItem) => void;
  services: ServiceItem[];
  appointments: Appointment[];
  specialists: Specialist[];
  clients: ClientProfile[];
  studioConfig: StudioConfig;
  waitlist: WaitlistEntry[];
  freedSlotAlert: FreedSlotEvent | null;
  setFreedSlotAlert: (alert: FreedSlotEvent | null) => void;
  autoNotifyWaitlist: boolean;
  setAutoNotifyWaitlist: (enabled: boolean) => void;
  addAppointment: (apt: Omit<Appointment, 'id'>) => Appointment;
  approveAppointment: (id: string, assignedSpecialistId?: string) => void;
  rejectAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newTime: string, newDate?: string) => void;
  unblockSlot: (id: string) => void;
  addService: (service: Omit<ServiceItem, 'id' | 'monthlyViews' | 'monthlyBookings'>) => ServiceItem;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
  updateStudioConfig: (updates: Partial<StudioConfig>) => void;
  bookServiceQuick: (service: ServiceItem) => void;
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => WaitlistEntry;
  removeFromWaitlist: (id: string) => void;
  updateWaitlistStatus: (id: string, status: WaitlistStatus, message?: string) => void;
  assignSlotToWaitlistClient: (waitlistId: string, slotInfo: FreedSlotEvent) => void;
  triggerManualSlotFreedDemo: () => void;
  clientNotificationPreferences: ClientNotificationPreferences;
  updateClientNotificationPreferences: (prefs: Partial<ClientNotificationPreferences>) => void;
  loyaltyProfile: LoyaltyProfile;
  availableRewardCoupons: LoyaltyRewardCoupon[];
  activeAppliedCoupon: LoyaltyRewardCoupon | null;
  setActiveAppliedCoupon: (coupon: LoyaltyRewardCoupon | null) => void;
  redeemCoupon: (couponId: string) => { success: boolean; message: string; coupon?: LoyaltyRewardCoupon };
  addLoyaltyPoints: (points: number, reason: string, serviceTitle?: string) => void;
  adjustClientPoints: (clientId: string, deltaPoints: number, reason: string) => void;
  reviews: ServiceReview[];
  addReview: (review: Omit<ServiceReview, 'id' | 'dateStr' | 'status'>) => ServiceReview;
  updateReviewStatus: (reviewId: string, status: ReviewStatus) => void;
  toggleFeatureReview: (reviewId: string) => void;
  replyToReview: (reviewId: string, replyMessage: string, author?: string) => void;
  deleteReview: (reviewId: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem('latelier_role') as Role) || 'client';
  });

  const [clientTab, setClientTab] = useState<ClientTab>('agendar');
  const [adminTab, setAdminTab] = useState<AdminTab>('agenda');
  const [viewportMode, setViewportMode] = useState<'responsive' | 'mobile_preview' | 'desktop_preview'>('responsive');

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('latelier_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('latelier_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [specialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('latelier_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    const saved = localStorage.getItem('latelier_config');
    return saved ? JSON.parse(saved) : INITIAL_STUDIO_CONFIG;
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('latelier_waitlist');
    return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
  });

  const [clientNotificationPreferences, setClientNotificationPreferences] = useState<ClientNotificationPreferences>(() => {
    const saved = localStorage.getItem('latelier_client_notifications');
    return saved
      ? JSON.parse(saved)
      : {
          whatsapp: true,
          sms: true,
          email: false,
          reminder24h: true,
          reminder2h: true,
          waitlistAlerts: true,
          postTreatmentTips: true,
          phone: '+1 (555) 349-8821',
          emailAddress: 'elena.rostova@luxury.com',
          clientName: 'Elena Rostova',
        };
  });

  const [autoNotifyWaitlist, setAutoNotifyWaitlistState] = useState<boolean>(() => {
    const saved = localStorage.getItem('latelier_autonotify_waitlist');
    return saved ? JSON.parse(saved) : true;
  });

  const [freedSlotAlert, setFreedSlotAlert] = useState<FreedSlotEvent | null>(null);

  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0] || INITIAL_SERVICES[0]);

  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>(() => {
    const saved = localStorage.getItem('latelier_loyalty_profile');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY_PROFILE;
  });

  const [availableRewardCoupons] = useState<LoyaltyRewardCoupon[]>(AVAILABLE_REWARD_COUPONS);
  const [activeAppliedCoupon, setActiveAppliedCoupon] = useState<LoyaltyRewardCoupon | null>(null);

  useEffect(() => {
    localStorage.setItem('latelier_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('latelier_services', JSON.stringify(services));
    syncToDb('syncServices', services);
  }, [services]);

  useEffect(() => {
    localStorage.setItem('latelier_appointments', JSON.stringify(appointments));
    syncToDb('syncAppointments', appointments);
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('latelier_clients', JSON.stringify(clients));
    syncToDb('syncClients', clients);
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('latelier_config', JSON.stringify(studioConfig));
  }, [studioConfig]);

  useEffect(() => {
    localStorage.setItem('latelier_waitlist', JSON.stringify(waitlist));
    syncToDb('syncWaitlist', waitlist);
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem(
      'latelier_client_notifications',
      JSON.stringify(clientNotificationPreferences)
    );
  }, [clientNotificationPreferences]);

  useEffect(() => {
    localStorage.setItem('latelier_loyalty_profile', JSON.stringify(loyaltyProfile));
  }, [loyaltyProfile]);

  const [reviews, setReviews] = useState<ServiceReview[]>(() => {
    const saved = localStorage.getItem('latelier_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('latelier_reviews', JSON.stringify(reviews));
    syncToDb('syncReviews', reviews);
  }, [reviews]);

  // Initial load from DB
  useEffect(() => {
    fetchFromDb().then(data => {
      if (data) {
        if (data.appointments?.length > 0) setAppointments(data.appointments);
        if (data.clients?.length > 0) setClients(data.clients);
        if (data.waitlist?.length > 0) setWaitlist(data.waitlist);
        if (data.reviews?.length > 0) setReviews(data.reviews);
        if (data.services?.length > 0) setServices(data.services);
      }
    });
  }, []);


  // Submit client post-service review with photos
  const addReview = (reviewData: Omit<ServiceReview, 'id' | 'dateStr' | 'status'>): ServiceReview => {
    const newRev: ServiceReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      dateStr: 'Hoy',
      status: 'pendiente', // New reviews go to moderation
    };

    setReviews((prev) => [newRev, ...prev]);

    // Bonus reward: +100 Points Privilège for sharing review and manicure photos
    addLoyaltyPoints(
      100,
      `Bono reseña con fotos del set (${reviewData.serviceTitle})`,
      reviewData.serviceTitle
    );

    return newRev;
  };

  const updateReviewStatus = (reviewId: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  const toggleFeatureReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const replyToReview = (
    reviewId: string,
    replyMessage: string,
    author: string = "Valerie M. (Directora)"
  ) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              adminReply: {
                message: replyMessage,
                repliedAt: 'Hoy',
                author,
              },
            }
          : r
      )
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // Add loyalty points to current client profile
  const addLoyaltyPoints = (points: number, reason: string, serviceTitle?: string) => {
    const newTx: PointsTransaction = {
      id: `tx-${Date.now()}`,
      dateStr: 'Hoy',
      type: points > 0 ? 'earned' : 'adjustment',
      points,
      description: reason,
      serviceTitle,
    };

    setLoyaltyProfile((prev) => {
      const newBalance = Math.max(0, prev.pointsBalance + points);
      const newTotal = points > 0 ? prev.totalPointsEarned + points : prev.totalPointsEarned;
      const newTier = newTotal >= 2500 ? 'privilege' : newTotal >= 1000 ? 'elegance' : 'membre';

      return {
        ...prev,
        pointsBalance: newBalance,
        totalPointsEarned: newTotal,
        tier: newTier,
        transactions: [newTx, ...prev.transactions],
      };
    });

    setClients((prev) =>
      prev.map((c) =>
        c.id === 'cl-1' || c.name.toLowerCase().includes('elena')
          ? {
              ...c,
              pointsBalance: Math.max(0, (c.pointsBalance || 0) + points),
            }
          : c
      )
    );
  };

  // Adjust points for any client from Admin directory
  const adjustClientPoints = (clientId: string, deltaPoints: number, reason: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newBal = Math.max(0, (c.pointsBalance || 0) + deltaPoints);
          const newTier = newBal >= 2500 ? 'privilege' : newBal >= 1000 ? 'elegance' : 'membre';
          return {
            ...c,
            pointsBalance: newBal,
            loyaltyTier: newTier,
          };
        }
        return c;
      })
    );

    if (clientId === 'cl-1') {
      addLoyaltyPoints(deltaPoints, reason);
    }
  };

  // Redeem a reward coupon with points
  const redeemCoupon = (couponId: string) => {
    const couponDef = availableRewardCoupons.find((c) => c.id === couponId);
    if (!couponDef) {
      return { success: false, message: 'Recompensa no encontrada.' };
    }
    if (loyaltyProfile.pointsBalance < couponDef.pointsCost) {
      return {
        success: false,
        message: `Puntos insuficientes. Requiere ${couponDef.pointsCost} pts (disponibles: ${loyaltyProfile.pointsBalance} pts).`,
      };
    }

    const newCoupon: LoyaltyRewardCoupon = {
      ...couponDef,
      id: `coup-${Date.now()}`,
      isRedeemed: true,
      canjeDate: 'Hoy',
    };

    const newTx: PointsTransaction = {
      id: `tx-${Date.now()}`,
      dateStr: 'Hoy',
      type: 'redeemed',
      points: -couponDef.pointsCost,
      description: `Canje de ${couponDef.title} (-$${couponDef.discountUsd} USD)`,
      discountAppliedUsd: couponDef.discountUsd,
    };

    setLoyaltyProfile((prev) => {
      const newBal = prev.pointsBalance - couponDef.pointsCost;
      return {
        ...prev,
        pointsBalance: newBal,
        transactions: [newTx, ...prev.transactions],
        activeCoupons: [newCoupon, ...prev.activeCoupons],
      };
    });

    setClients((prev) =>
      prev.map((cl) =>
        cl.id === 'cl-1' || cl.name.toLowerCase().includes('elena')
          ? { ...cl, pointsBalance: loyaltyProfile.pointsBalance - couponDef.pointsCost }
          : cl
      )
    );

    setActiveAppliedCoupon(newCoupon);

    return {
      success: true,
      message: `¡Cupón de $${couponDef.discountUsd} USD canjeado exitosamente! Aplicado a tu próxima cita.`,
      coupon: newCoupon,
    };
  };

  const updateClientNotificationPreferences = (
    prefs: Partial<ClientNotificationPreferences>
  ) => {
    setClientNotificationPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const setAutoNotifyWaitlist = (enabled: boolean) => {
    setAutoNotifyWaitlistState(enabled);
    localStorage.setItem('latelier_autonotify_waitlist', JSON.stringify(enabled));
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Update client list or create new client profile
    setClients((prev) => {
      const existing = prev.find(
        (c) =>
          c.phone === aptData.clientPhone ||
          c.name.toLowerCase() === aptData.clientName.toLowerCase()
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalVisits: c.totalVisits + 1,
                lastVisit: 'Hoy',
                favoriteTechnique: aptData.serviceTitle || c.favoriteTechnique,
              }
            : c
        );
      } else {
        const newClient: ClientProfile = {
          id: `cl-${Date.now()}`,
          name: aptData.clientName,
          phone: aptData.clientPhone,
          totalVisits: 1,
          favoriteTechnique: aptData.serviceTitle,
          favoriteColor: aptData.toneName || 'Natural',
          lastVisit: 'Hoy',
          notes: aptData.clientNotes || 'Registrada vía formulario de agendamiento.',
        };
        return [newClient, ...prev];
      }
    });

    return newApt;
  };

  const approveAppointment = (id: string, assignedSpecialistId?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const spec = assignedSpecialistId
            ? specialists.find((s) => s.id === assignedSpecialistId)
            : specialists[0];
          return {
            ...apt,
            status: 'confirmada',
            specialistId: spec?.id || 'valeria',
            specialistName: spec?.name || 'Valeria M.',
            station: spec?.station || 'Mesa 01 • Puesto Principal',
            depositPaid: apt.price * 0.5,
          };
        }
        return apt;
      })
    );
  };

  const rejectAppointment = (id: string) => {
    cancelAppointment(id);
  };

  const cancelAppointment = (id: string) => {
    const targetApt = appointments.find((a) => a.id === id);
    if (!targetApt) return;

    // Filter out canceled appointment or mark as canceled
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));

    // Find candidates in waitlist
    // Priority order: VIP > Alta > Normal, then matching shift or specialist
    const candidates = waitlist
      .filter((w) => w.status === 'esperando')
      .sort((a, b) => {
        const prioScore: Record<string, number> = { vip: 3, alta: 2, normal: 1 };
        return prioScore[b.priority] - prioScore[a.priority];
      });

    // Best matching candidates
    const matched = candidates.filter((c) => {
      const shiftMatch = c.preferredShift === 'cualquiera' || c.preferredShift === targetApt.shift;
      const specMatch =
        !c.preferredSpecialistId ||
        c.preferredSpecialistId === 'any' ||
        c.preferredSpecialistId === targetApt.specialistId;
      return shiftMatch && specMatch;
    });

    const finalCandidates = matched.length > 0 ? matched : candidates.slice(0, 3);
    const notifiedIds: string[] = [];

    // If auto-notify is enabled, dispatch notification to the top candidate(s)
    if (autoNotifyWaitlist && finalCandidates.length > 0) {
      const topCandidate = finalCandidates[0];
      notifiedIds.push(topCandidate.id);

      const autoMessage = `Hola ${topCandidate.clientName}, ¡se acaba de liberar un espacio a las ${targetApt.time} con ${targetApt.specialistName} para ${targetApt.serviceTitle}! Tienes 15 minutos de reserva prioritaria.`;

      setWaitlist((prev) =>
        prev.map((w) =>
          w.id === topCandidate.id
            ? {
                ...w,
                status: 'notificada',
                notifiedAt: 'Ahora mismo',
                notificationMessage: autoMessage,
              }
            : w
        )
      );
    }

    // Trigger the interactive modal alert
    const event: FreedSlotEvent = {
      appointmentId: targetApt.id,
      time: targetApt.time,
      dateStr: targetApt.dateStr,
      shift: targetApt.shift,
      specialistId: targetApt.specialistId,
      specialistName: targetApt.specialistName,
      serviceTitle: targetApt.serviceTitle,
      price: targetApt.price,
      canceledClientName: targetApt.clientName,
      timestamp: Date.now(),
      matchedCandidates: finalCandidates,
      notifiedCandidateIds: notifiedIds,
    };

    setFreedSlotAlert(event);
  };

  const rescheduleAppointment = (id: string, newTime: string, newDate?: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          return {
            ...apt,
            time: newTime,
            dateStr: newDate || apt.dateStr,
            status: 'confirmada',
          };
        }
        return apt;
      })
    );
  };

  const unblockSlot = (id: string) => {
    const targetApt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));

    if (targetApt) {
      // Find candidate in waitlist
      const candidates = waitlist.filter((w) => w.status === 'esperando');
      if (candidates.length > 0) {
        const topCandidate = candidates[0];
        const event: FreedSlotEvent = {
          appointmentId: targetApt.id,
          time: targetApt.time,
          dateStr: targetApt.dateStr,
          shift: 'tarde',
          specialistId: 'valeria',
          specialistName: 'Valeria M.',
          serviceTitle: 'Espacio Desbloqueado',
          price: 55.0,
          canceledClientName: 'Bloqueo Técnico',
          timestamp: Date.now(),
          matchedCandidates: candidates.slice(0, 3),
          notifiedCandidateIds: autoNotifyWaitlist ? [topCandidate.id] : [],
        };

        if (autoNotifyWaitlist) {
          setWaitlist((prev) =>
            prev.map((w) =>
              w.id === topCandidate.id
                ? {
                    ...w,
                    status: 'notificada',
                    notifiedAt: 'Ahora mismo',
                    notificationMessage: `Espacio desbloqueado a las ${targetApt.time}.`,
                  }
                : w
            )
          );
        }

        setFreedSlotAlert(event);
      }
    }
  };

  const addService = (
    serviceData: Omit<ServiceItem, 'id' | 'monthlyViews' | 'monthlyBookings'>
  ): ServiceItem => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `serv-${Date.now()}`,
      monthlyViews: 1,
      monthlyBookings: 0,
    };
    setServices((prev) => [newService, ...prev]);
    return newService;
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'activo' ? 'borrador' : 'activo';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const updateStudioConfig = (updates: Partial<StudioConfig>) => {
    setStudioConfig((prev) => ({ ...prev, ...updates }));
  };

  const bookServiceQuick = (service: ServiceItem) => {
    setSelectedService(service);
    setRole('client');
    setClientTab('agendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Waitlist Operations
  const addToWaitlist = (
    entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>
  ): WaitlistEntry => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wl-${Date.now()}`,
      createdAt: 'Ahora mismo',
      status: 'esperando',
    };
    setWaitlist((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const removeFromWaitlist = (id: string) => {
    setWaitlist((prev) => prev.filter((w) => w.id !== id));
  };

  const updateWaitlistStatus = (id: string, status: WaitlistStatus, message?: string) => {
    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status,
              notifiedAt: status === 'notificada' ? 'Ahora mismo' : w.notifiedAt,
              notificationMessage: message || w.notificationMessage,
            }
          : w
      )
    );
  };

  const assignSlotToWaitlistClient = (waitlistId: string, slotInfo: FreedSlotEvent) => {
    const entry = waitlist.find((w) => w.id === waitlistId);
    if (!entry) return;

    // Create the appointment in the calendar
    addAppointment({
      time: slotInfo.time,
      durationText: '1h 30m',
      durationMinutes: 90,
      shift: slotInfo.shift,
      shiftLabel: slotInfo.shift === 'mañana' ? 'Turno Mañana' : 'Turno Tarde',
      clientName: entry.clientName,
      clientPhone: entry.clientPhone,
      clientNotes: entry.notes || 'Reasignada automáticamente desde Lista de Espera.',
      isVip: entry.priority === 'vip',
      serviceId: entry.serviceId,
      serviceTitle: entry.serviceTitle,
      toneName: 'A definir en cabina',
      toneHex: '#EAD8CB',
      specialistId: slotInfo.specialistId,
      specialistName: slotInfo.specialistName,
      station: 'Mesa 01 • Puesto Principal',
      price: slotInfo.price,
      depositPaid: slotInfo.price * 0.5,
      status: 'confirmada',
      dateStr: slotInfo.dateStr,
    });

    // Mark waitlist entry as assigned
    setWaitlist((prev) =>
      prev.map((w) =>
        w.id === waitlistId
          ? {
              ...w,
              status: 'asignada',
              notes: `Asignada exitosamente a las ${slotInfo.time} con ${slotInfo.specialistName}.`,
            }
          : w
      )
    );

    // Dismiss alert
    setFreedSlotAlert(null);
  };

  // Quick Demo Simulator for the Admin
  const triggerManualSlotFreedDemo = () => {
    // Simulate freeing up 09:30 AM
    const mockFreedEvent: FreedSlotEvent = {
      appointmentId: 'demo-cancel',
      time: '09:30 AM',
      dateStr: '2024-11-19',
      shift: 'mañana',
      specialistId: 'valeria',
      specialistName: 'Valeria M.',
      serviceTitle: 'Acrílico Francés Perla',
      price: 55.0,
      canceledClientName: 'Elena Rostova',
      timestamp: Date.now(),
      matchedCandidates: waitlist.filter((w) => w.status === 'esperando'),
      notifiedCandidateIds: waitlist.length > 0 ? [waitlist[0].id] : [],
    };

    if (autoNotifyWaitlist && waitlist.length > 0) {
      setWaitlist((prev) =>
        prev.map((w, idx) =>
          idx === 0
            ? {
                ...w,
                status: 'notificada',
                notifiedAt: 'Ahora mismo',
                notificationMessage: `Hola ${w.clientName}, se liberó el turno de las 09:30 AM con Valeria M.`,
              }
            : w
        )
      );
    }

    setFreedSlotAlert(mockFreedEvent);
  };

  return (
    <StudioContext.Provider
      value={{
        role,
        setRole,
        clientTab,
        setClientTab,
        adminTab,
        setAdminTab,
        viewportMode,
        setViewportMode,
        selectedService,
        setSelectedService,
        services,
        appointments,
        specialists,
        clients,
        studioConfig,
        waitlist,
        freedSlotAlert,
        setFreedSlotAlert,
        autoNotifyWaitlist,
        setAutoNotifyWaitlist,
        addAppointment,
        approveAppointment,
        rejectAppointment,
        cancelAppointment,
        rescheduleAppointment,
        unblockSlot,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        updateStudioConfig,
        bookServiceQuick,
        addToWaitlist,
        removeFromWaitlist,
        updateWaitlistStatus,
        assignSlotToWaitlistClient,
        triggerManualSlotFreedDemo,
        clientNotificationPreferences,
        updateClientNotificationPreferences,
        loyaltyProfile,
        availableRewardCoupons,
        activeAppliedCoupon,
        setActiveAppliedCoupon,
        redeemCoupon,
        addLoyaltyPoints,
        adjustClientPoints,
        reviews,
        addReview,
        updateReviewStatus,
        toggleFeatureReview,
        replyToReview,
        deleteReview,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};

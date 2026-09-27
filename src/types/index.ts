export type Role = 'client' | 'admin';

export type ClientTab = 'catalogo' | 'agendar' | 'trabajos' | 'agenda' | 'notificaciones' | 'puntos';
export type AdminTab = 'agenda' | 'catalogo' | 'waitlist' | 'clientas' | 'horarios' | 'reportes' | 'resenas';

export type ReviewStatus = 'aprobada' | 'pendiente' | 'rechazada';

export interface ServiceReview {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientAvatar?: string;
  isVip?: boolean;
  appointmentId?: string;
  serviceId: string;
  serviceTitle: string;
  specialistId: string;
  specialistName: string;
  rating: number; // 1 to 5
  aspectRatings?: {
    technique: number;
    hygiene: number;
    service: number;
    durability: number;
  };
  comment: string;
  photos: string[];
  dateStr: string;
  status: ReviewStatus;
  isFeatured?: boolean;
  adminReply?: {
    message: string;
    repliedAt: string;
    author: string;
  };
}

export type LoyaltyTier = 'membre' | 'elegance' | 'privilege';

export interface PointsTransaction {
  id: string;
  dateStr: string;
  type: 'earned' | 'redeemed' | 'bonus' | 'adjustment';
  points: number; // positive for earned, negative for redeemed
  description: string;
  serviceTitle?: string;
  discountAppliedMXN?: number;
}

export interface LoyaltyRewardCoupon {
  id: string;
  title: string;
  subtitle: string;
  pointsCost: number;
  discountMXN: number;
  code: string;
  isRedeemed: boolean;
  canjeDate?: string;
}

export interface LoyaltyProfile {
  clientId: string;
  clientName: string;
  pointsBalance: number;
  totalPointsEarned: number;
  tier: LoyaltyTier;
  memberSince: string;
  membershipNumber: string;
  transactions: PointsTransaction[];
  activeCoupons: LoyaltyRewardCoupon[];
}

export interface ClientNotificationPreferences {
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
  waitlistAlerts: boolean;
  postTreatmentTips: boolean;
  phone: string;
  emailAddress: string;
  clientName: string;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  photo: string;
  station: string;
}

export type ServiceStatus = 'activo' | 'borrador' | 'archivado';
export type ServiceCategory = 'acrilicas' | 'rusa' | 'soft-gel' | 'nail-art' | 'spa';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  categoryLabel: string;
  durationMinutes: number;
  price: number;
  image: string;
  status: ServiceStatus;
  tag?: 'TOP' | 'NUEVO' | 'ESTRELLA';
  monthlyViews: number;
  monthlyBookings: number;
  formulaNotes?: string;
}

export type AppointmentStatus = 'confirmada' | 'en_proceso' | 'pendiente' | 'bloqueado' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  time: string;
  durationText: string;
  durationMinutes: number;
  shift: 'mañana' | 'tarde' | 'cierre' | 'bloqueo';
  shiftLabel: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  clientAvatar?: string;
  isVip?: boolean;
  isFirstVisit?: boolean;
  isRegular?: boolean;
  serviceId: string;
  serviceTitle: string;
  toneName: string;
  toneHex: string;
  specialistId: string;
  specialistName: string;
  station: string;
  price: number;
  depositPaid?: number;
  status: AppointmentStatus;
  currentMinuteProgress?: number;
  dateStr: string; // e.g. "2024-11-19"
  requestedTimeAgo?: string;
  blockReason?: string;
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsDiscountMXN?: number;
}

export type WaitlistStatus = 'esperando' | 'notificada' | 'asignada' | 'expirada';
export type WaitlistPriority = 'vip' | 'alta' | 'normal';

export interface WaitlistEntry {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceTitle: string;
  preferredSpecialistId?: string; // or 'any'
  preferredSpecialistName?: string;
  preferredShift: 'mañana' | 'tarde' | 'cualquiera';
  preferredDateStr: string;
  targetTimeSlot?: string;
  status: WaitlistStatus;
  priority: WaitlistPriority;
  createdAt: string;
  notifiedAt?: string;
  notificationMessage?: string;
  notes?: string;
}

export interface FreedSlotEvent {
  appointmentId: string;
  time: string;
  dateStr: string;
  shift: 'mañana' | 'tarde' | 'cierre' | 'bloqueo';
  specialistId: string;
  specialistName: string;
  serviceTitle: string;
  price: number;
  canceledClientName: string;
  timestamp: number;
  matchedCandidates?: WaitlistEntry[];
  notifiedCandidateIds?: string[];
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isVip?: boolean;
  totalVisits: number;
  favoriteTechnique: string;
  favoriteColor: string;
  lastVisit: string;
  notes: string;
  pointsBalance?: number;
  loyaltyTier?: LoyaltyTier;
}

export interface WorkDayConfig {
  id: string;
  label: string;
  shortLabel: string;
  isOpen: boolean;
  specialNote?: string;
}

export interface StudioConfig {
  workDays: WorkDayConfig[];
  openingHour: string;
  closingHour: string;
  cleanupProtocolMinutes: number;
  maxDailyCapacity: number;
}

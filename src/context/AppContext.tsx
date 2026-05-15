import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AppContextValue,
  FlightBooking,
  HotelBooking,
  Language,
  User,
} from "../types";
import { translations } from "../i18n";

const APP_LANG = "hotel-flight-lang";
const APP_USER = "hotel-flight-user";
const APP_BOOKINGS = "hotel-flight-bookings";
const APP_LOCAL_USERS = "hotel-flight-local-users";
const API_BASE = "/api";

// ── Local auth helpers (fallback when server is offline) ─────────────────────
const hashPasswordLocal = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "rh4ll4-salt-2025");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const getLocalUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(APP_LOCAL_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem(APP_LOCAL_USERS, JSON.stringify(users));
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const defaultLanguage: Language = "ar";

const loadLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
};

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() =>
    loadLocalStorage<Language>(APP_LANG, defaultLanguage),
  );
  const [user, setUser] = useState<User | null>(() =>
    loadLocalStorage<User | null>(APP_USER, null),
  );
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);

  useEffect(() => {
    const savedBookings = loadLocalStorage<{
      hotel: HotelBooking[];
      flight: FlightBooking[];
    }>(APP_BOOKINGS, {
      hotel: [],
      flight: [],
    });
    setHotelBookings(savedBookings.hotel);
    setFlightBookings(savedBookings.flight);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(APP_LANG, JSON.stringify(language));
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(APP_USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(
      APP_BOOKINGS,
      JSON.stringify({ hotel: hotelBookings, flight: flightBookings }),
    );
  }, [hotelBookings, flightBookings]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const translate = (key: string) => {
    const segment = key.split(".");
    return (
      segment.reduce((obj: any, part) => obj?.[part], translations[language]) ??
      key
    );
  };

  const login = async (email: string, password: string) => {
    if (typeof window === "undefined") return false;
    // Try server first
    try {
      const userData = await fetchJson<User>(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setUser(userData);
      return true;
    } catch {
      // Server unavailable — fallback to localStorage
    }
    try {
      const hashedPassword = await hashPasswordLocal(password);
      const localUsers = getLocalUsers();
      const found = localUsers.find(
        (u) => u.email === email && u.password === hashedPassword
      );
      if (!found) return false;
      const { password: _pw, ...safeUser } = found as User & { password: string };
      setUser(safeUser as User);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (newUser: Omit<User, "id">) => {
    if (typeof window === "undefined") return false;
    // Try server first
    try {
      const createdUser = await fetchJson<User>(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      setUser(createdUser);
      return true;
    } catch {
      // Server unavailable — fallback to localStorage
    }
    try {
      const localUsers = getLocalUsers();
      if (localUsers.some((u) => u.email === newUser.email)) return false;
      const hashedPassword = await hashPasswordLocal(newUser.password);
      const created: User & { password: string } = {
        ...newUser,
        id: `user-${Date.now()}`,
        password: hashedPassword,
      };
      saveLocalUsers([...localUsers, created]);
      const { password: _pw, ...safeUser } = created;
      setUser(safeUser as User);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    if (typeof window === "undefined") return;
    try {
      const savedUser = await fetchJson<User>(
        `${API_BASE}/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        },
      );
      setUser(savedUser);
    } catch {
      // Keep local state if backend update fails.
    }
  };

  const addHotelBooking = (booking: Omit<HotelBooking, "id" | "status">) => {
    const newBooking: HotelBooking = {
      ...booking,
      id: `hotel-booking-${Date.now()}`,
      status: "confirmed",
    };
    setHotelBookings((prev) => [...prev, newBooking]);
  };

  const addFlightBooking = (booking: Omit<FlightBooking, "id" | "status">) => {
    const newBooking: FlightBooking = {
      ...booking,
      id: `flight-booking-${Date.now()}`,
      status: "confirmed",
    };
    setFlightBookings((prev) => [...prev, newBooking]);
  };

  const removeHotelBooking = (id: string) => {
    setHotelBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const removeFlightBooking = (id: string) => {
    setFlightBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const updateHotelBooking = (
    id: string,
    updatedBooking: Partial<HotelBooking>,
  ) => {
    setHotelBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, ...updatedBooking } : booking,
      ),
    );
  };

  const updateFlightBooking = (
    id: string,
    updatedBooking: Partial<FlightBooking>,
  ) => {
    setFlightBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, ...updatedBooking } : booking,
      ),
    );
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translate,
      user,
      login,
      register,
      logout,
      updateUser,
      hotelBookings,
      flightBookings,
      addHotelBooking,
      addFlightBooking,
      removeHotelBooking,
      removeFlightBooking,
      updateHotelBooking,
      updateFlightBooking,
    }),
    [language, user, hotelBookings, flightBookings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
};

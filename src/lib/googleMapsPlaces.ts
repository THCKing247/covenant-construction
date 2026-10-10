export const GOOGLE_MAPS_CALLBACK = "__ccgGoogleMapsInit";

type PlaceResult = {
  formatted_address?: string;
};

export type AddressAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => { remove: () => void };
  getPlace: () => PlaceResult;
};

type GoogleMapsPlaces = {
  Autocomplete: new (
    input: HTMLInputElement,
    options: {
      componentRestrictions: { country: "us" };
      types: ["address"];
      fields: ["formatted_address"];
    }
  ) => AddressAutocomplete;
};

declare global {
  interface Window {
    __ccgGoogleMapsInit?: () => void;
    google?: {
      maps: {
        places: GoogleMapsPlaces;
        event: {
          clearInstanceListeners: (instance: object) => void;
        };
      };
    };
  }
}

export function googleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || undefined;
}

let placesLoader: Promise<void> | null = null;

export function loadGoogleMapsPlaces(key: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if (window.google?.maps?.places) return Promise.resolve();
  if (placesLoader) return placesLoader;

  placesLoader = new Promise((resolve, reject) => {
    window.__ccgGoogleMapsInit = () => resolve();
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key,
      libraries: "places",
      loading: "async",
      callback: GOOGLE_MAPS_CALLBACK,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      placesLoader = null;
      reject(new Error("Google Maps failed to load"));
    };
    document.head.appendChild(script);
  });

  return placesLoader;
}

export function createAddressAutocomplete(input: HTMLInputElement): AddressAutocomplete {
  if (!window.google?.maps?.places) {
    throw new Error("Google Places is not available");
  }
  return new window.google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "us" },
    types: ["address"],
    fields: ["formatted_address"],
  });
}

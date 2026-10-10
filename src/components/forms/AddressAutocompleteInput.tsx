"use client";

import { useEffect, useRef } from "react";
import {
  createAddressAutocomplete,
  googleMapsApiKey,
  loadGoogleMapsPlaces,
  type AddressAutocomplete,
} from "@/lib/googleMapsPlaces";

type AddressAutocompleteInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
};

export function AddressAutocompleteInput({
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  maxLength,
  disabled,
  className,
}: AddressAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const apiKey = googleMapsApiKey();

  useEffect(() => {
    if (!apiKey) return;
    const input = inputRef.current;
    if (!input) return;

    let active = true;
    let autocomplete: AddressAutocomplete | null = null;
    let listener: { remove: () => void } | null = null;

    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (!active || !inputRef.current) return;
        autocomplete = createAddressAutocomplete(inputRef.current);
        listener = autocomplete.addListener("place_changed", () => {
          const formatted = autocomplete?.getPlace().formatted_address;
          if (formatted) onChangeRef.current(formatted);
        });
      })
      .catch(() => {
        // A typed address can still be submitted.
      });

    return () => {
      active = false;
      listener?.remove();
      if (autocomplete) window.google?.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [apiKey]);

  return (
    <div className={className ? `${className} address-field` : "address-field"}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        autoComplete={apiKey ? "off" : "street-address"}
        aria-autocomplete={apiKey ? "list" : undefined}
      />
      {apiKey ? <p className="address-hint">Pick an address from the suggestions as you type.</p> : null}
    </div>
  );
}

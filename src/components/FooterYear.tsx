"use client";

import { useEffect, useState } from "react";

export function FooterYear() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <span id="year">{year}</span>;
}

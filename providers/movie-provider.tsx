"use client";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
export type MovieContextType = {
  currentMovie: any;
  setCurrentMovie: Dispatch<SetStateAction<any>>;
};
export const MovieContext = createContext<MovieContextType | undefined>(
  undefined,
);

type Props = {
  dataServer: any;
} & PropsWithChildren;
export default function MovieProvider({ children, dataServer }: Props) {
  const [currentMovie, setCurrentMovie] = useState<any>(undefined);
  useEffect(() => {
    if (dataServer.item.episodes.length) {
      const firstEp = dataServer.item.episodes?.[0]?.server_data?.[0];
      if (firstEp) setCurrentMovie(firstEp);
    }
  }, [dataServer]);
  return (
    <MovieContext.Provider value={{ currentMovie, setCurrentMovie }}>
      {children}
    </MovieContext.Provider>
  );
}
export function useMovie() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovie must be used inside MovieProvider");
  }

  return context;
}

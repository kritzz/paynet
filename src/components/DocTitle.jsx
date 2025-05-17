import { useEffect } from "react";

export default function DocTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
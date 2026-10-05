import dayjs from "dayjs";

// Company formats live in WM, not here. Check these two pages before changing anything:
//   WM | Date format            https://app.notion.com/p/c9e5a7fdd2f541a1a6bf127e3e92cc27
//   WM | Three digit comma rule https://app.notion.com/p/3ba0ef434e254bb4a20d10cb17f57655

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "-";
  return dayjs(iso).format("YYYY.MM.DD");
};

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "-";
  return dayjs(iso).format("YYYY.MM.DD HH:mm");
};

// 1234567 -> "1,234,567"
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("en-US");
};

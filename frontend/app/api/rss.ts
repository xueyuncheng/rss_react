import useSWR from "swr";

export const apiBase = "http://localhost:10000/api";

export type RSSField = {
  id: number;
  name: string;
  url: string;
};

export type ListRSSResp = {
  total: number;
  items: RSSField[];
};

export function ListRSS(page_no: number) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  return useSWR(`${apiBase}/rsses?page_no=${page_no}&page_size=10`, fetcher);
}

export async function DeleteRSS(id: number) {
  const res = await fetch(`${apiBase}/rsses/${id}`, {
    method: "DELETE",
  });

  const { _, err } = await res.json();
  if (err) {
    console.log(err);
    return;
  }

  return;
}

export async function AddRSS(rss: RSSField) {
  const response = await fetch(`${apiBase}/rsses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rss),
  });

  const { _, err } = await response.json();
  if (err) {
    console.log(err);
    return;
  }
}

export async function GetRSS(id: number) {
  const res = await fetch(`${apiBase}/rsses/${id}`);
  const { data, err } = await res.json();
  if (err) {
    console.log(err);
    return;
  }

  return data;
}

export async function UpdateRSS(rss: RSSField) {
  const res = await fetch(`${apiBase}/rsses/${rss.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rss),
  });

  const { _, err } = await res.json();
  if (err) {
    console.log(err);
    return;
  }
}

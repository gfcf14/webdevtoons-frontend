export interface Link {
  type: string;
  url: string;
}

export interface Post {
  date: string;
  description: string;
  image: string;
  links: Link[];
  title: string;
}
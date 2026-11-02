
export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Beach 1",
    category: "Photography",
    year: "2026",
    image: "/images/project-1.JPG",
    description: "Photo 1 of the beach series."
  },
  {
    id: 2,
    title: "Secret Garden",
    category: "Photography",
    year: "2026",
    image: "/images/project-2.jpg",
    description: "Photo of the secret garden series."
  },
  {
    id: 3,
    title: "Beach 2",
    category: "Photography",
    year: "2026",
    image: "/images/project-3.JPG",
    description: "Photo 3 of the beach series."
  },
  {
    id: 4,
    title: "Beach 3",
    category: "Photography",
    year: "2026",
    image: "/images/project-4.JPG",
    description: "Photo 4 of the beach series."
  }
];

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const USERS = [
  {
    id: "1",
    avatar: "/assets/user-images/image-zena.jpg",
    name: "Zena Kelley",
    username: "velvetround",
  },
  {
    id: "2",
    avatar: "/assets/user-images/image-suzanne.jpg",
    name: "Suzanne Chang",
    username: "upbeat1811",
  },
  {
    id: "3",
    avatar: "/assets/user-images/image-thomas.jpg",
    name: "Thomas Hood",
    username: "brawnybrave",
  },
  {
    id: "4",
    avatar: "/assets/user-images/image-elijah.jpg",
    name: "Elijah Moss",
    username: "hexagon.bestagon",
  },
  {
    id: "5",
    avatar: "/assets/user-images/image-james.jpg",
    name: "James Skinner",
    username: "hummingbird1",
  },
  {
    id: "6",
    avatar: "/assets/user-images/image-anne.jpg",
    name: "Anne Valentine",
    username: "annev1990",
  },
  {
    id: "7",
    avatar: "/assets/user-images/image-ryan.jpg",
    name: "Ryan Welles",
    username: "voyager.344",
  },
  {
    id: "8",
    avatar: "/assets/user-images/image-george.jpg",
    name: "George Partridge",
    username: "soccerviewer8",
  },
  {
    id: "9",
    avatar: "/assets/user-images/image-javier.jpg",
    name: "Javier Pollard",
    username: "warlikeduke",
  },
  {
    id: "10",
    avatar: "/assets/user-images/image-roxanne.jpg",
    name: "Roxanne Travis",
    username: "peppersprime32",
  },
  {
    id: "11",
    avatar: "/assets/user-images/image-victoria.jpg",
    name: "Victoria Mejia",
    username: "arlen_the_marlin",
  },
  {
    id: "12",
    avatar: "/assets/user-images/image-zena.jpg",
    name: "Zena Kelley",
    username: "velvetround",
  },
  {
    id: "13",
    avatar: "/assets/user-images/image-jackson.jpg",
    name: "Jackson Barker",
    username: "countryspirit",
  },
];

async function seed() {
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });
}

seed()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

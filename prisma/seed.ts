import { Feedback, PrismaClient, Reply } from "@prisma/client";

const prisma = new PrismaClient();

function generateUpvotes(upvotesCount: number) {
  return Array(upvotesCount)
    .fill("")
    .map((val, idx) => ({ userId: String(idx + 1) }));
}

async function seed() {
  await prisma.user.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.comment.deleteMany();
  console.log("✅ Database Cleared!");

  await prisma.user.createMany({
    data: getUsers(),
    skipDuplicates: true,
  });
  console.log("✅ Users Created!");

  await Promise.all(
    getFeedbacks().map(async (fb) => {
      return await prisma.feedback.create({
        data: {
          userId: fb.userId,
          category: fb.category as Feedback["category"],
          status: fb.status as Feedback["status"],
          description: fb.description,
          title: fb.title,
          upvotes: {
            createMany: { data: generateUpvotes(fb.upvotes) },
          },
          comments: {
            createMany: { data: fb.comments },
          },
        },
      });
    })
  );
  console.log("✅ Feedbacks Created!");
}
seed()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getFeedbacks() {
  return [
    {
      userId: "1",
      title: "Add tags for solutions",
      status: "SUGGESTION",
      category: "ENHANCEMENT",
      description: "Easier to search for solutions based on a specific stack.",
      upvotes: 112,
      comments: [
        {
          userId: "2",
          content:
            "Awesome idea! Trying to find framework-specific projects within the hubs can be tedious",
        },
        {
          userId: "3",
          content:
            "Please use fun, color-coded labels to easily identify them at a glance",
        },
      ],
    },
    {
      userId: "1",
      title: "Add a dark theme option",
      category: "FEATURE",
      upvotes: 99,
      status: "SUGGESTION",
      description:
        "It would help people with light sensitivities and who prefer dark mode.",
      comments: [
        {
          content:
            "Also, please allow styles to be applied based on system preferences. I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
          userId: "4",
        },
        {
          userId: "5",
          content:
            "Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and  apparently saves battery life.",
        },
      ],
    },
  ];
}

function getUsers() {
  return [
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
}

// replies: {
//   createMany: {
//     data: [
//       {
//         content:
//           "While waiting for dark mode, there are browser extensions that will also do the job. Search for 'dark theme' followed by your browser. There might be a need to turn off the extension for sites with naturally black backgrounds though.",
//         repliedFromId: "6",
//         repliedToId: "5",
//       },
//       {
//         content:
//           "Good point! Using any kind of style extension is great and can be highly customizable, like the ability to change contrast and brightness. I'd prefer not to use one of such extensions, however, for security and privacy reasons.",
//         repliedToId: "6",
//         replyFromId: "7",
//       },
//     ],
//   },
// },

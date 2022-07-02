import { Feedback, PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

function generateUpvotes(upvotesCount: number) {
  return Array(upvotesCount)
    .fill("")
    .map((_, idx) => ({ userId: String(idx + 1) }));
}

async function seed() {
  console.log("🌱 Starts seeding!");
  await prisma.user.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reply.deleteMany();
  console.log("✅ Database Cleared!");

  await prisma.user.createMany({
    data: getUsers(),
    skipDuplicates: true
  });
  console.log("✅ Users Created!");

  await Promise.all(
    getFeedbacks().map(async (fb) => {
      return await prisma.feedback.create({
        data: {
          userId: "1",
          category: fb.category.toUpperCase() as Feedback["category"],
          status: fb.status.toUpperCase() as Feedback["status"],
          description: fb.description,
          title: fb.title,
          upvotes: {
            createMany: { data: generateUpvotes(fb.upvotes) }
          },
          comments: {
            createMany: { data: fb.comments ?? [] }
          }
        }
      });
    })
  );
  console.log("✅ Feedbacks Created!");

  await Promise.all(
    getReplies().map(async (reply) => {
      return await prisma.reply.create({
        data: {
          commentId: reply.commentId,
          replyFromId: reply.replyFromId,
          repliedToId: reply.repliedToId,
          content: reply.content
        }
      });
    })
  );
  console.log("✅ Replies Created!");
  console.log("🏁 Done seeding!");
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
          id: 1,
          userId: "2",
          content:
            "Awesome idea! Trying to find framework-specific projects within the hubs can be tedious"
        },
        {
          id: 2,
          userId: "3",
          content: "Please use fun, color-coded labels to easily identify them at a glance"
        }
      ]
    },
    {
      userId: "1",
      title: "Add a dark theme option",
      category: "FEATURE",
      upvotes: 99,
      status: "SUGGESTION",
      description: "It would help people with light sensitivities and who prefer dark mode.",
      comments: [
        {
          id: 3,
          content:
            "Also, please allow styles to be applied based on system preferences. I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
          userId: "4"
        },
        {
          id: 4,
          userId: "5",
          content:
            "Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and  apparently saves battery life."
        }
      ]
    },
    {
      userId: "1",
      id: 3,
      title: "Q&A within the challenge hubs",
      category: "FEATURE",
      upvotes: 65,
      status: "SUGGESTION",
      description: "Challenge-specific Q&A would make for easy reference.",
      comments: [
        {
          id: 5,
          content:
            "Much easier to get answers from devs who can relate, since they've either finished the challenge themselves or are in the middle of it.",
          userId: "6"
        }
      ]
    },
    {
      userId: "1",
      id: 4,
      title: "Add image/video upload to feedback",
      category: "enhancement",
      upvotes: 51,
      status: "suggestion",
      description: "avatars and screencasts can enhance comments on solutions.",
      comments: [
        {
          id: 6,
          content:
            "Right now, there is no ability to add avatars while giving feedback which isn't ideal because I have to use another app to show what I mean",
          userId: "7"
        },
        {
          id: 7,
          content:
            "Yes I'd like to see this as well. Sometimes I want to add a short video or gif to explain the site's behavior..",
          userId: "8"
        }
      ]
    },
    {
      id: 5,
      title: "Ability to follow others",
      category: "feature",
      upvotes: 42,
      status: "suggestion",
      description: "Stay updated on comments and solutions other people post.",
      comments: [
        {
          id: 8,
          content:
            "I also want to be notified when devs I follow submit projects on FEM. Is in-app notification also in the pipeline?",
          userId: "9"
        },
        {
          userId: "10",
          id: 9,
          content:
            "I've been saving the profile URLs of a few people and I check what they’ve been doing from time to time. Being able to follow them solves that"
        }
      ]
    },
    {
      id: 6,
      title: "Preview avatars not loading",
      category: "bug",
      upvotes: 3,
      status: "suggestion",
      description: "Challenge preview avatars are missing when you apply a filter."
    },
    {
      id: 7,
      title: "More comprehensive reports",
      category: "feature",
      upvotes: 123,
      status: "planned",
      description: "It would be great to see a more detailed breakdown of solutions.",
      comments: [
        {
          id: 10,
          content:
            "This would be awesome! It would be so helpful to see an overview of my code in a way that makes it easy to spot where things could be improved.",
          userId: "11"
        },
        {
          id: 11,
          content: "Yeah, this would be really good. I'd love to see deeper insights into my code!",
          userId: "13"
        }
      ]
    },
    {
      id: 8,
      title: "Learning paths",
      category: "feature",
      upvotes: 28,
      status: "planned",
      description: "Sequenced projects for different goals to help people improve.",
      comments: [
        {
          id: 12,
          content:
            "Having a path through the challenges that I could follow would be brilliant! Sometimes I'm not sure which challenge would be the best next step to take. So this would help me navigate through them!",
          userId: "8"
        }
      ]
    },
    {
      id: 9,
      title: "One-click portfolio generation",
      category: "feature",
      upvotes: 62,
      status: "in_progress",
      description: "Add ability to create professional looking portfolio from profile.",
      comments: [
        {
          id: 13,
          content:
            "I haven't built a portfolio site yet, so this would be really helpful. Might it also be possible to choose layout and colour themes?!",
          userId: "7"
        }
      ]
    },
    {
      id: 10,
      title: "Bookmark challenges",
      category: "feature",
      upvotes: 31,
      status: "in_progress",
      description: "Be able to bookmark challenges to take later on.",
      comments: [
        {
          id: 14,
          content:
            "This would be great! At the moment, I'm just starting challenges in order to save them. But this means the My Challenges section is overflowing with projects and is hard to manage. Being able to bookmark challenges would be really helpful.",
          userId: "2"
        }
      ]
    },
    {
      id: 11,
      title: "Animated solution screenshots",
      category: "bug",
      upvotes: 9,
      status: "in_progress",
      description: "Screenshots of solutions with animations don’t display correctly."
    },
    {
      id: 12,
      title: "Add micro-interactions",
      category: "enhancement",
      upvotes: 71,
      status: "live",
      description: "Small animations at specific points can add delight.",
      comments: [
        {
          id: 15,
          content:
            "I'd love to see this! It always makes me so happy to see little details like these on websites.",
          userId: "11"
        }
      ]
    }
  ];
}

function getReplies() {
  return [
    {
      content:
        "While waiting for dark mode, there are browser extensions that will also do the job. Search for 'dark theme' followed by your browser. There might be a need to turn off the extension for sites with naturally black backgrounds though.",
      replyFromId: "6",
      repliedToId: "5",
      commentId: 4
    },
    {
      content:
        "Good point! Using any kind of style extension is great and can be highly customizable, like the ability to change contrast and brightness. I'd prefer not to use one of such extensions, however, for security and privacy reasons.",
      repliedToId: "6",
      replyFromId: "7",
      commentId: 4
    },
    {
      commentId: 8,
      content:
        "Bumping this. It would be good to have a tab with a feed of people I follow so it's easy to see what challenges they’ve done lately. I learn a lot by reading good developers' code.",
      repliedToId: "9",
      replyFromId: "1"
    },
    {
      content:
        "Me too! I'd also love to see celebrations at specific points as well. It would help people take a moment to celebrate their achievements!",
      repliedToId: "11",
      replyFromId: "2",
      commentId: 15
    }
  ];
}

function getUsers() {
  return [
    {
      id: "1",
      image: "/assets/user-images/image-zena.jpg",
      name: "Zena Kelley",
      username: "velvetround"
    },
    {
      id: "2",
      image: "/assets/user-images/image-suzanne.jpg",
      name: "Suzanne Chang",
      username: "upbeat1811"
    },
    {
      id: "3",
      image: "/assets/user-images/image-thomas.jpg",
      name: "Thomas Hood",
      username: "brawnybrave"
    },
    {
      id: "4",
      image: "/assets/user-images/image-elijah.jpg",
      name: "Elijah Moss",
      username: "hexagon.bestagon"
    },
    {
      id: "5",
      image: "/assets/user-images/image-james.jpg",
      name: "James Skinner",
      username: "hummingbird1"
    },
    {
      id: "6",
      image: "/assets/user-images/image-anne.jpg",
      name: "Anne Valentine",
      username: "annev1990"
    },
    {
      id: "7",
      image: "/assets/user-images/image-ryan.jpg",
      name: "Ryan Welles",
      username: "voyager.344"
    },
    {
      id: "8",
      image: "/assets/user-images/image-george.jpg",
      name: "George Partridge",
      username: "soccerviewer8"
    },
    {
      id: "9",
      image: "/assets/user-images/image-javier.jpg",
      name: "Javier Pollard",
      username: "warlikeduke"
    },
    {
      id: "10",
      image: "/assets/user-images/image-roxanne.jpg",
      name: "Roxanne Travis",
      username: "peppersprime32"
    },
    {
      id: "11",
      image: "/assets/user-images/image-victoria.jpg",
      name: "Victoria Mejia",
      username: "arlen_the_marlin"
    },
    {
      id: "12",
      image: "/assets/user-images/image-zena.jpg",
      name: "Zena Kelley",
      username: "velvetround"
    },
    {
      id: "13",
      image: "/assets/user-images/image-jackson.jpg",
      name: "Jackson Barker",
      username: "countryspirit"
    }
  ];
}

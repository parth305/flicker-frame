import PostCard from "@/components/ui/posts/postCard";

export default function Post() {
  return (
    <div className="wrapper mt-10 max-w-lg mx-auto">
      <PostCard
        key={1}
        user={{
          id: 1,
          name: "Jay Mehta",
          username: "jay_mehta",
          avatar: "/avatar.jpeg",
        }}
        comments={[
          {
            id: 1,
            content: "Hello World",
            createdAt: new Date().toUTCString(),
            user: {
              id: 1,
              name: "Jay Mehta",
              username: "jay_mehta",
              avatar: "/avatar.jpeg",
            },
          },
        ]}
        caption="Some caption Here"
        images={["/avatar.jpeg", "/file.svg", "/globe.svg"]}
        taggedUsers={[{ id: 2, username: "wodj" }]}
      />
    </div>
  );
}

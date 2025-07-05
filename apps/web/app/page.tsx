import { getSession } from "@/lib/getSession";

const Home = async () => {
  const session = await getSession();
  console.log("Home", { session });
  return <div>Home</div>;
};

export default Home;

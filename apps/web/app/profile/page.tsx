import { getProfile } from "@/lib/actions";

const Profile = async () => {
  const response = await getProfile();
  return (
    <div>
      profile
      <p>{JSON.stringify(response)}</p>
    </div>
  );
};

export default Profile;

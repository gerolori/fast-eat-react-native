import React, { useEffect } from "react";
import InfoProfile from "./InfoProfile";
import ViewModel from "../../viewmodels/ViewModel";
const ProfilePage = () => {
  const savePage = async () => {
    await ViewModel.saveLastScreenAsync("ProfilePage");
  };

  useEffect(() => {
    savePage();
  }, []);

  return <InfoProfile />;
};
export default ProfilePage;

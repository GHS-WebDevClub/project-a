export type ProfileType = {
  public: PublicProfile,
  private: PrivateProfile,
};

export type PublicProfile = {
  displayName: string;
  image?: string;
};

export type PrivateProfile = {
  email?: string;
  phone?: string;
};
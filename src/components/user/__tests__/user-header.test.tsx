import { render, screen } from "@testing-library/react";
import { UserHeader } from "@/components/user/user-header";
import type { GithubUser } from "@/types/github";
import { LanguageProvider } from "@/contexts/language-context";

const makeUser = (overrides: Partial<GithubUser>): GithubUser => {
  return {
    login: overrides.login ?? "user",
    id: 1,
    node_id: "",
    avatar_url: "https://example.com/avatar.png",
    gravatar_id: null,
    url: "",
    html_url: "https://github.com/user",
    followers_url: "",
    following_url: "",
    gists_url: "",
    starred_url: "",
    subscriptions_url: "",
    organizations_url: "",
    repos_url: "",
    events_url: "",
    received_events_url: "",
    type: "User",
    site_admin: false,
    name: overrides.name ?? "User Name",
    company: null,
    blog: null,
    location: overrides.location ?? "Brazil",
    email: null,
    hireable: null,
    bio: overrides.bio ?? "Bio",
    twitter_username: null,
    public_repos: 10,
    public_gists: 0,
    followers: overrides.followers ?? 5,
    following: overrides.following ?? 3,
    created_at: overrides.created_at ?? "2020-01-01T00:00:00Z",
    updated_at: overrides.updated_at ?? "2024-01-01T00:00:00Z",
  };
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <LanguageProvider>{children}</LanguageProvider>;
};

describe("UserHeader", () => {
  it("renderiza nome, login e métricas básicas do usuário", () => {
    const user = makeUser({
      login: "miquelven",
      name: "Miquel Ven",
      followers: 42,
      following: 7,
    });

    render(
      <Wrapper>
        <UserHeader user={user} />
      </Wrapper>
    );

    expect(screen.getByText("Miquel Ven")).toBeInTheDocument();
    expect(screen.getByText("@miquelven")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});

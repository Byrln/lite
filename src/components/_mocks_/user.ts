import { sample } from "lodash";

import { mockImgAvatar } from "lib/utils/mock-images";

const users = [...Array(24)].map((_, index) => ({
    id: 1,
    avatarUrl: mockImgAvatar(index + 1),
    name: "Bilegsaikhan",
    company: "IO Tech",
    isVerified: true,
    status: sample(["active", "banned"]),
    role: sample([
        "Leader",
        "Hr Manager",
        "UI Designer",
        "UX Designer",
        "UI/UX Designer",
        "Project Manager",
        "Backend Developer",
        "Full Stack Designer",
        "Front End Developer",
        "Full Stack Developer",
    ]),
}));

export default users;

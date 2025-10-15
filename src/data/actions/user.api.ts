const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 회원정보 수정
 */
export async function updateUser(data: {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
}) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("회원정보 수정에 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("[updateUser]", err);
    return null;
  }
}

/**
 * 회원 탈퇴
 */
export async function deleteUser() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/user/quit`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error("[deleteUser]", err);
    return false;
  }
}

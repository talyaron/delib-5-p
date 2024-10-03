interface GeneratePasswordProps {
  statementId: string | undefined;
  setPlainPassword: (password: number) => void; 
}

async function GeneratePassword({
  statementId,
  setPlainPassword,
}: GeneratePasswordProps) {
  try {
    const plainPassword = Math.floor(1000 + Math.random() * 9000);
    setPlainPassword(plainPassword); 

    console.log(plainPassword); 

    const response = await fetch(
      "http://localhost:5001/delib-v3-dev/us-central1/hashPassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statementId,
          plainPassword,
        }),
      }
    );

    if (response.ok) {
      const responseData = await response.json();
      return responseData.ok;
    } else {
      console.error(
        "Error posting to server:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error in HTTP request:", error);
  }
}

export default GeneratePassword;
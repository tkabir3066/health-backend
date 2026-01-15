// Parse agent response to extract only doctor info
export const extractDoctorInfo = async (
  agentResponse: string
): Promise<any[]> => {
  try {
    // Extract JSON from markdown code block
    const jsonMatch = agentResponse.match(/```json\s*(\[[\s\S]*?\])\s*```/);

    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("No valid JSON found in agent response");
    }

    const jsonString = jsonMatch[1];
    const doctors = JSON.parse(jsonString);

    // Filter only valid doctors (not deleted)
    return doctors.filter(
      (doctor: any) =>
        doctor &&
        !doctor.isDeleted &&
        doctor.name &&
        doctor.doctorSpecialties?.length > 0
    );
  } catch (error) {
    console.error("Error parsing doctor info:", error);
    return [];
  }
};

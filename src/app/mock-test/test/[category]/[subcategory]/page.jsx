import TestQuestions from "@/components/jobSeeker/pages/ai_section/mock_test/TestQuestions";
import React from "react";

const TestPage = ({ params }) => {
    const category = decodeURIComponent(params.category);
    const subcategory = decodeURIComponent(params.subcategory);

  return (
    <>
      <TestQuestions category={category} subcategory={subcategory} />
    </>
  );
};

export default TestPage;
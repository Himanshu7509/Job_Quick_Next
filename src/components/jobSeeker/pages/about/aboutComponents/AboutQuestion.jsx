"use client"
import React from 'react'

const AboutQuestion = () => (
    <section className="py-12 px-[10%]">
    <h2 className="text-3xl font-bold text-center mb-8">
      Frequently Asked Questions
    </h2>
    <div className="space-y-4">
      {[
        {
          question: "Can I upload a CV?",
          answer: "Yes, you can upload a CV directly to your account.",
        },
        {
          question: "How long will the recruitment process take?",
          answer: "It depends on the company and job position.",
        },
        {
          question: "Do you recruit for Graduates, Apprentices, and Students?",
          answer: "Yes, we support all career stages.",
        },
        {
          question: "What does the recruitment and selection process involve?",
          answer: "Screening, interviews, and evaluations.",
        },
        {
          question:
            "Can I receive notifications for future jobs that may interest me?",
          answer: "Yes, enable job alerts in your settings.",
        },
      ].map((faq, index) => (
        <details
          key={index}
          className="bg-gray-100 rounded-lg p-4 cursor-pointer group"
        >
          <summary className="font-bold text-gray-800 group-hover:underline">
            {faq.question}
          </summary>
          <p className="mt-2 text-gray-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export default AboutQuestion
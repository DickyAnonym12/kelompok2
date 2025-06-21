import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const FaqContext = createContext();

export function FaqProvider({ children }) {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqadmin").select("*");

    if (error) {
      console.error("Error fetching FAQ:", error.message);
      setFaq([]);
    } else {
      const mappedData = data.map(item => ({
        id: item.id,
        question: item.pertanyaan,
        answer: item.jawaban,
      }));
      setFaq(mappedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFaqs();
  }, []);

  const addFaq = async (newFaq) => {
    const { error } = await supabase
      .from('faqadmin')
      .insert([{ pertanyaan: newFaq.question, jawaban: newFaq.answer }]);
    if (error) {
      console.error("Error inserting FAQ:", error.message);
    } else {
      getFaqs();
    }
  };

  const updateFaq = async (id, updatedFaq) => {
    const { error } = await supabase
      .from('faqadmin')
      .update({ pertanyaan: updatedFaq.question, jawaban: updatedFaq.answer })
      .eq('id', id);
    if (error) {
      console.error("Error updating FAQ:", error.message);
    } else {
      getFaqs();
    }
  };

  const deleteFaq = async (id) => {
    const { error } = await supabase
      .from('faqadmin')
      .delete()
      .eq('id', id);
    if (error) {
      console.error("Error deleting FAQ:", error.message);
    } else {
      getFaqs();
    }
  };

  return (
    <FaqContext.Provider value={{ faq, loading, addFaq, updateFaq, deleteFaq }}>
      {children}
    </FaqContext.Provider>
  );
}

export function useFaq() {
  return useContext(FaqContext);
} 
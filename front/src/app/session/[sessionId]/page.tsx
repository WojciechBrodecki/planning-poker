import Cards from "@/app/components/Layout/Cards/Cards";
import Header from "@/app/components/Layout/Header/Header";
import Main from "@/app/components/Layout/Main/Main";

export default function Session({ params }: { params: { sessionId: string } }) {
  return (
    <div>
      <Header title="Planning Poker" />
      <Main />
      <Cards />
    </div>
  )
}
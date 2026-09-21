import Header from './Header';
import Hero from './Hero';
import Countdown from './Countdown';
import Story from './Story';
import Details from './Details';
import Travel from './Travel';
import Rsvp from './Rsvp';
import GuestBook from './GuestBook';
import BridalTrain from './BridalTrain';
import InvitationTeaser from './InvitationTeaser';
import Closing from './Closing';
import TravelChat from './TravelChat';

export default function WeddingPage() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Header />
      <Hero />
      <Countdown />
      <Story />
      <Details />
      <Travel />
      <InvitationTeaser />
      <Rsvp />
      <GuestBook />
      <BridalTrain />
      <Closing />
      {/* Rendered once here, not inside Travel, so its fixed trigger icon
          and right-docked panel stay available while scrolling through
          every section of the page, not just Getting There. */}
      <TravelChat />
    </div>
  );
}

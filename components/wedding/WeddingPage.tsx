import Header from './Header';
import Hero from './Hero';
import Countdown from './Countdown';
import Story from './Story';
import Details from './Details';
import Travel from './Travel';
import Rsvp from './Rsvp';
import GuestBook from './GuestBook';
import InvitationTeaser from './InvitationTeaser';
import Closing from './Closing';

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
      <Closing />
    </div>
  );
}

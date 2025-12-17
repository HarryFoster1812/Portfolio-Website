import SubscribeCard from './subscribeCard'

interface SubscribeSectionProps {
  variant: 'home' | 'blog' | 'blogList';
}

export const SubscribeSection: React.FC<SubscribeSectionProps> = ({ variant }) => {
  let heading = '';
  let description = '';
  let bgClasses = '';

    switch (variant) {
        case 'home':
            heading = 'Dive Into the Blog & Stay Ahead';
            description =
                'Explore in-depth tutorials, experiments, and insights. Subscribe to never miss the latest updates!';
            bgClasses = 'bg-zinc-900';
            break;
        case 'blog':
            heading = 'Enjoyed This Post?';
            description =
                'If this article sparked your curiosity, subscribe and get the newest deep dives straight to your inbox.';
            break;
        case 'blogList':
            heading = 'Keep Your Learning Flowing';
            description =
                'Receive alerts for newly published posts, tutorials, and experiments. Stay ahead without checking manually.';
            bgClasses = 'bg-zinc-900';
            break;
    }

  return (
    <section
    className={`relative flex items-center justify-center py-20 flex-col ${bgClasses}`}
    style={{ height: 'calc(100vh - 5rem)' }}
    >  
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[120%] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{heading}</h2>
        <p className="text-zinc-300 mb-8">{description}</p>
        <SubscribeCard />
    </section>
  );
};

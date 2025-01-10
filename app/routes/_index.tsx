import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { useStore } from '@nanostores/react';
import { themeStore } from '~/lib/stores/theme';
import { useEffect, useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Karol all mightyr' },
    { name: 'description', content: 'Talk with Karči, an AI assistant from StackBlitz' },
  ];
};

export const loader = () => json({});

export default function Index() {
  const theme = useStore(themeStore);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1"
      style={
        mounted
          ? {
              backgroundImage: `url(${theme === 'dark' ? '/dark.jpg' : '/light.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}

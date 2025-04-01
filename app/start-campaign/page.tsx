'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useForm } from '@tanstack/react-form';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAccount } from 'wagmi';

// Dynamically import the emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type FormState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
};

type TierData = {
  title: string;
  description: string;
  amount: string;
  emoji: string;
  perk: string;
};

type FormStep = 'campaign-info' | 'tiers';

export default function Home() {
  const { address } = useAccount();

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  const [currentStep, setCurrentStep] = useState<FormStep>('campaign-info');
  const [tiers, setTiers] = useState<TierData[]>([
    { title: '', description: '', amount: '0', emoji: '🏅', perk: '' },
  ]);
  const [showCampaignEmojiPicker, setShowCampaignEmojiPicker] = useState(false);
  const [showTierEmojiPicker, setShowTierEmojiPicker] = useState<number | null>(
    null,
  );

  const router = useRouter();

  const [endDate, setEndDate] = useState<Date | null>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      goal: '',
      endDate: '',
      creatorAddress: '',
      emoji: '🚀',
    },
    onSubmit: async ({ value }) => {
      try {
        setFormState({ isSubmitting: true, isSuccess: false, error: null });

        if (!address) {
          throw new Error('Please connect your wallet to create a campaign');
        }

        // Prepare the campaign data for submission
        const campaignData = {
          ...value,
          creatorAddress: address,
          tiers: tiers,
        };

        // Submit to our API
        const response = await fetch('/api/v1/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create campaign');
        }

        setFormState({ isSubmitting: false, isSuccess: true, error: null });

        // Navigate to the newly created campaign after a short delay
        setTimeout(() => {
          router.push(`/campaign/${result.data.id}`);
        }, 1500);
      } catch (error) {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },
  });

  const addTier = () => {
    setTiers([
      ...tiers,
      { title: '', description: '', amount: '0', emoji: '🏅', perk: '' },
    ]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof TierData, value: string) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setTiers(updatedTiers);
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate the form before proceeding
    const hasTitle = !!form.getFieldValue('title');
    const hasDescription = !!form.getFieldValue('description');
    const hasValidGoal = parseFloat(form.getFieldValue('goal') || '0') > 0;
    const hasErrors = !hasTitle || !hasDescription || !hasValidGoal;

    if (!hasErrors) {
      setCurrentStep('tiers');
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep('campaign-info');
  };

  const validateTiers = () => {
    for (const tier of tiers) {
      if (!tier.title) return 'Tier title is required';
      if (!tier.description) return 'Tier description is required';
      if (!tier.perk) return 'Tier perk is required';
      if (parseFloat(tier.amount) <= 0)
        return 'Tier amount must be greater than 0';
    }
    return null;
  };

  // Close emoji pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close campaign emoji picker if clicking outside
      if (showCampaignEmojiPicker) {
        const target = event.target as Node;
        const emojiContainer = document.getElementById(
          'campaign-emoji-container',
        );
        if (emojiContainer && !emojiContainer.contains(target)) {
          setShowCampaignEmojiPicker(false);
        }
      }

      // Close tier emoji picker if clicking outside
      if (showTierEmojiPicker !== null) {
        const target = event.target as Node;
        const tierEmojiContainer = document.getElementById(
          `tier-emoji-container-${showTierEmojiPicker}`,
        );
        if (tierEmojiContainer && !tierEmojiContainer.contains(target)) {
          setShowTierEmojiPicker(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCampaignEmojiPicker, showTierEmojiPicker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only proceed with submission when in tiers step
    if (currentStep === 'tiers') {
      const tierError = validateTiers();
      if (tierError) {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: tierError,
        });
        return;
      }
      form.handleSubmit();
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg relative">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="absolute left-6 top-6">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm"
            aria-label="Go back"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mb-4 relative">
          <form.Field name="emoji">
            {(field) => (
              <div
                id="campaign-emoji-container"
                className="flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowCampaignEmojiPicker(!showCampaignEmojiPicker)
                  }
                  className="text-4xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full h-16 w-16 flex items-center justify-center"
                >
                  {field.state.value || '🚀'}
                </button>
                <span className="text-xs mt-1 text-gray-500">
                  Campaign Emoji
                </span>

                {showCampaignEmojiPicker && (
                  <div className="absolute top-full z-10 mt-2">
                    <EmojiPicker
                      onEmojiClick={(emojiObj) => {
                        field.handleChange(emojiObj.emoji);
                        setShowCampaignEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <CardTitle className="text-xl">Start Your Campaign</CardTitle>
        <CardDescription>
          {currentStep === 'campaign-info'
            ? 'Create your own crowdfunding campaign'
            : 'Set up reward tiers for your backers'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {currentStep === 'campaign-info' ? (
            <>
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">
                  Campaign Title
                </label>
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Title is required' : undefined,
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="title"
                        placeholder="Enter campaign title"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors ? (
                        <p className="text-red-500 text-xs mt-1">
                          {field.state.meta.errors}
                        </p>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <form.Field
                  name="description"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Description is required' : undefined,
                  }}
                >
                  {(field) => (
                    <>
                      <textarea
                        id="description"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        placeholder="Describe your campaign"
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors ? (
                        <p className="text-red-500 text-xs mt-1">
                          {field.state.meta.errors}
                        </p>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <label htmlFor="goal" className="block text-sm font-medium">
                  Funding Goal ($)
                </label>
                <form.Field
                  name="goal"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Funding goal is required';
                      if (parseFloat(value) <= 0)
                        return 'Goal must be greater than 0';
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <Input
                        id="goal"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter funding goal"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors ? (
                        <p className="text-red-500 text-xs mt-1">
                          {field.state.meta.errors}
                        </p>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium">
                  End Date
                </label>
                <DatePicker
                  id="endDate"
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    form.setFieldValue(
                      'endDate',
                      date ? date.toISOString() : '',
                    );
                  }}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholderText="Select end date and time"
                  required
                  minDate={new Date()}
                  popperClassName="z-50"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <div key={index} className="p-4 border rounded-md relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 p-0 h-6 w-6 text-red-500"
                      onClick={() => removeTier(index)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium">
                          Tier Title
                        </label>
                        <Input
                          placeholder="Bronze Supporter"
                          value={tier.title}
                          onChange={(e) =>
                            updateTier(index, 'title', e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                          placeholder="What supporters get at this tier"
                          rows={2}
                          value={tier.description}
                          onChange={(e) =>
                            updateTier(index, 'description', e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium">
                          Perk
                        </label>
                        <textarea
                          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                          placeholder="Specific reward for this tier"
                          rows={2}
                          value={tier.perk}
                          onChange={(e) =>
                            updateTier(index, 'perk', e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">
                            Amount ($)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="10.00"
                            value={tier.amount}
                            onChange={(e) =>
                              updateTier(index, 'amount', e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-1 relative">
                          <label className="block text-sm font-medium">
                            Tier Emoji
                          </label>
                          <div
                            id={`tier-emoji-container-${index}`}
                            className="flex"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full shadow-sm"
                              onClick={() =>
                                setShowTierEmojiPicker(
                                  index === showTierEmojiPicker ? null : index,
                                )
                              }
                            >
                              {tier.emoji}
                            </Button>

                            {showTierEmojiPicker === index && (
                              <div className="absolute z-10 right-0 mt-1">
                                <EmojiPicker
                                  onEmojiClick={(emojiObj) => {
                                    updateTier(index, 'emoji', emojiObj.emoji);
                                    setShowTierEmojiPicker(null);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={addTier}
                >
                  <Plus className="h-4 w-4" /> Add Tier
                </Button>
              </div>
            </>
          )}

          {formState.error && (
            <div className="bg-red-50 text-red-500 p-2 rounded-md text-sm my-2">
              {formState.error}
            </div>
          )}

          {formState.isSuccess && (
            <div className="bg-green-50 text-green-600 p-2 rounded-md text-sm my-2">
              Campaign created successfully!
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3 justify-between mt-4">
          {currentStep === 'tiers' && (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="flex-1"
            >
              Back
            </Button>
          )}

          {currentStep === 'campaign-info' ? (
            <Button className="flex-1" onClick={goToNextStep} variant="purple">
              Continue to Tiers
            </Button>
          ) : !!address ? (
            <Button
              type="submit"
              className="flex-1"
              disabled={formState.isSubmitting}
              variant="purple"
            >
              {formState.isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          ) : (
            <ConnectButton />
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

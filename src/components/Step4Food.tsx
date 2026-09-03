import React from 'react';
import { Utensils, Star, Phone, CheckCircle2, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Pitstop, FoodItem, SelectedFoodItem } from '../types';
import { formatINR } from '../utils/pricing';

interface Step4FoodProps {
  foodStops: Pitstop[];
  selectedFoodStops: Pitstop[];
  selectedFoodItems: SelectedFoodItem[];
  numberOfPeople: number;
  wantsFood: boolean | null;
  fromLocation: string;
  toLocation: string;
  onChooseWantsFood: (choice: boolean) => void;
  onToggleFoodStop: (pitstop: Pitstop) => void;
  onAddFoodItem: (item: FoodItem, stop: Pitstop) => void;
  onRemoveFoodItem: (selectionId: string) => void;
  onUpdateItemQuantity: (selectionId: string, quantity: number) => void;
  onUpdatePeopleCount?: (count: number) => void;
  onContinue: () => void;
  onGoBack: () => void;
}

export const Step4Food: React.FC<Step4FoodProps> = ({
  foodStops,
  selectedFoodStops,
  selectedFoodItems,
  numberOfPeople,
  wantsFood,
  fromLocation,
  toLocation,
  onChooseWantsFood,
  onToggleFoodStop,
  onAddFoodItem,
  onRemoveFoodItem,
  onUpdateItemQuantity,
  onUpdatePeopleCount,
  onContinue,
  onGoBack,
}) => {
  const isComplete = wantsFood !== null;
  const peopleCount = Math.max(1, numberOfPeople || 1);
  const peopleLabel = peopleCount === 1 ? '1 Person' : `${peopleCount} People`;

  const foodSubtotal = selectedFoodItems.reduce((acc, item) => {
    return acc + (item.pricePerPerson * peopleCount * (item.quantity || 1));
  }, 0);

  return (
    <section id="step-4-food" className="py-6 sm:py-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Back to Step 3 (Hotel)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Step 4 of 7</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight font-serif-luxury">
            Food & Pitstops
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Plan highway restaurants and food stops between <strong className="text-[#F3E5AB]">{fromLocation}</strong> and{' '}
            <strong className="text-[#F3E5AB]">{toLocation}</strong>.
          </p>
        </div>

        {/* YES / NO Decision Card */}
        <div className="ui-card-luxury p-6 sm:p-8 mb-8 text-center max-w-xl mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <h3 className="text-lg font-bold text-white mb-4 font-serif-luxury">
            Plan highway food stops?
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="food-choice-yes-btn"
              onClick={() => onChooseWantsFood(true)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsFood === true
                  ? 'gold-gradient-bg text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] border-[#D4AF37]'
                  : 'bg-[#0a0a0f] border-white/10 text-zinc-300 hover:border-[#D4AF37]/40'
              }`}
            >
              <div className="text-2xl">🍽️</div>
              <div className="text-sm font-bold">YES, Add Food Stops</div>
              <div className="text-[11px] text-zinc-400">Highway diners & dhabas</div>
            </button>

            <button
              type="button"
              id="food-choice-no-btn"
              onClick={() => onChooseWantsFood(false)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsFood === false
                  ? 'bg-[#1e1e2d] text-[#F3E5AB] border-[#D4AF37]/50 font-bold shadow-md'
                  : 'bg-[#0a0a0f] border-white/10 text-zinc-300 hover:border-[#D4AF37]/40'
              }`}
            >
              <div className="text-2xl">⚡</div>
              <div className="text-sm font-bold">NO Food Stops</div>
              <div className="text-[11px] text-zinc-400">Non-stop journey (₹0)</div>
            </button>
          </div>
        </div>

        {/* If YES */}
        {wantsFood === true && (
          <div className="space-y-6 animate-fade-in mb-8">
            
            {/* Target Calculation Banner */}
            <div className="ui-card-luxury p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D4AF37]/25">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Meal Calculation Target:</div>
                  <div className="text-sm sm:text-base font-bold text-white font-serif-luxury">
                    Calculating for <span className="text-[#F3E5AB] font-mono-tech">{peopleLabel}</span>
                  </div>
                </div>
              </div>

              {onUpdatePeopleCount && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">People:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => onUpdatePeopleCount(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          peopleCount === num
                            ? 'gold-gradient-bg text-black shadow-xs'
                            : 'bg-[#12121b] text-zinc-300 border border-white/10 hover:border-[#D4AF37]/50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {selectedFoodItems.length > 0 && (
              <div className="ui-card-luxury p-5 border-[#D4AF37]/40 shadow-[0_0_25px_rgba(212,175,55,0.15)]">
                <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-serif-luxury">Selected Food Items</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30 text-[10px] font-bold">
                      {selectedFoodItems.length} Item(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Food Subtotal</span>
                    <span className="text-lg font-bold text-[#F3E5AB] font-mono-tech">
                      {formatINR(foodSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 divide-y divide-[#D4AF37]/15">
                  {selectedFoodItems.map((item) => {
                    const itemTotal = item.pricePerPerson * peopleCount * (item.quantity || 1);
                    return (
                      <div key={item.id} className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <span className="font-semibold text-white">{item.name}</span>
                            {item.restaurantName && (
                              <span className="text-zinc-400 text-[11px]">at {item.restaurantName}</span>
                            )}
                          </div>
                          <div className="text-zinc-400 text-[11px] mt-0.5 font-mono-tech">
                            {formatINR(item.pricePerPerson)} per person × {peopleLabel}
                            {item.quantity > 1 ? ` × ${item.quantity} servings` : ''}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="flex items-center gap-1.5 bg-[#0a0a0f] border border-[#D4AF37]/30 px-2 py-0.5 rounded-lg">
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-[#D4AF37]" />
                            </button>
                            <span className="font-bold text-white px-1 text-xs">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(item.id, (item.quantity || 1) + 1)}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-[#D4AF37]" />
                            </button>
                          </div>

                          <span className="font-bold text-[#F3E5AB] font-mono-tech text-sm min-w-[70px] text-right">
                            {formatINR(itemTotal)}
                          </span>

                          <button
                            type="button"
                            onClick={() => onRemoveFoodItem(item.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Restaurant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foodStops.map((stop) => {
                const isSelectedStop = selectedFoodStops.some((s) => s.id === stop.id);
                const stopMenuItems = stop.menuItems || [
                  { id: `${stop.id}-m1`, name: 'Veg Meals (Thali)', pricePerPerson: 120, category: 'Meals', isVeg: true },
                  { id: `${stop.id}-m2`, name: 'Paneer Biryani', pricePerPerson: 200, category: 'Biryani', isVeg: true },
                  { id: `${stop.id}-m3`, name: 'Hot Masala Tea', pricePerPerson: 20, category: 'Beverages', isVeg: true },
                  { id: `${stop.id}-m4`, name: 'Mineral Water Bottle (1L)', pricePerPerson: 10, category: 'Beverages', isVeg: true },
                ];

                return (
                  <div
                    key={stop.id}
                    id={`food-card-${stop.id}`}
                    className={`ui-card group relative overflow-hidden transition-all duration-300 flex flex-col justify-between rounded-2xl ${
                      isSelectedStop 
                        ? 'bg-[#12121e] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                        : 'bg-[#0e0e15] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#151520] hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-[#09090d]">
                      <img
                        src={stop.image}
                        alt={stop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 text-[#F3E5AB] text-xs font-semibold backdrop-blur-md border border-[#D4AF37]/30">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{stop.rating}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white font-serif-luxury mb-1">
                          {stop.name}
                        </h3>

                        <div className="text-xs text-zinc-400 mb-3">
                          <span>{stop.location}</span> • <span className="text-[#F3E5AB] font-medium">{stop.cuisine}</span>
                        </div>

                        {/* Menu Items */}
                        <div className="mt-3 pt-3 border-t border-[#D4AF37]/20">
                          <div className="text-xs font-bold text-white font-serif-luxury mb-2 flex items-center justify-between">
                            <span>Menu Options</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Per Person Rate</span>
                          </div>

                          <div className="space-y-1.5">
                            {stopMenuItems.map((menuItem) => {
                              const alreadySelected = selectedFoodItems.find(
                                (item) => item.foodItemId === menuItem.id && item.restaurantId === stop.id
                              );

                              return (
                                <div
                                  key={menuItem.id}
                                  className="flex items-center justify-between p-2 rounded-xl bg-[#0a0a0f] border border-[#D4AF37]/20 text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${menuItem.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    <div>
                                      <div className="text-white font-medium">{menuItem.name}</div>
                                      <div className="text-[11px] text-[#F3E5AB] font-semibold font-mono-tech">
                                        {formatINR(menuItem.pricePerPerson)} / person
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    {alreadySelected ? (
                                      <span className="text-xs text-[#F3E5AB] font-bold px-2 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-lg">
                                        Added ({alreadySelected.quantity || 1})
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isSelectedStop) {
                                            onToggleFoodStop(stop);
                                          }
                                          onAddFoodItem(menuItem, stop);
                                        }}
                                        className="ui-btn-secondary py-1 px-2.5 text-xs text-[#F3E5AB] border-[#D4AF37]/40"
                                      >
                                        <Plus className="w-3 h-3 text-[#D4AF37]" />
                                        <span>Add</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
                        <div className="text-[11px] text-zinc-400">
                          {stop.estimatedStopover} stopover
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleFoodStop(stop)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            isSelectedStop
                              ? 'gold-gradient-bg text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                              : 'ui-btn-secondary'
                          }`}
                        >
                          {isSelectedStop ? 'Stop Added' : 'Add Stop'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="ui-card-luxury p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="ui-btn-secondary w-full sm:w-auto"
          >
            ← Back to Step 3
          </button>

          {isComplete ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-[#F3E5AB] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {wantsFood ? `${selectedFoodItems.length} item(s) selected` : 'Non-stop route'}
                </span>
              </div>
              <button
                type="button"
                id="step-4-next-btn"
                onClick={onContinue}
                className="ui-btn-primary w-full sm:w-auto"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#F3E5AB] font-medium">
              Please choose YES or NO for food stops
            </span>
          )}
        </div>

      </div>
    </section>
  );
};

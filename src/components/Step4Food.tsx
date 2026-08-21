import React, { useState } from 'react';
import { Utensils, Star, Phone, Check, ArrowRight, MapPin, CheckCircle2, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Pitstop, FoodItem, SelectedFoodItem } from '../types';
import { formatINR } from '../utils/pricing';

interface Step4FoodProps {
  foodStops: Pitstop[];
  selectedFoodStops: Pitstop[];
  selectedFoodItems: SelectedFoodItem[];
  numberOfPeople: number;
  wantsFood: boolean | null; // null = unchosen, true = yes, false = no
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

  // Calculate Food Subtotal
  const foodSubtotal = selectedFoodItems.reduce((acc, item) => {
    return acc + (item.pricePerPerson * peopleCount * (item.quantity || 1));
  }, 0);

  return (
    <section id="step-4-food" className="py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono-tech text-xs uppercase tracking-wider mb-2">
            <Utensils className="w-3.5 h-3.5" />
            <span>Step 4 of 7</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Step 4: <span className="gold-gradient-text">Food & Highway Pitstops</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Do you want food stops along the highway between <span className="text-white font-semibold">{fromLocation}</span> and{' '}
            <span className="text-white font-semibold">{toLocation}</span>?
          </p>
        </div>

        {/* Big YES / NO Decision Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8 border border-[#D4AF37]/30 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 font-serif-luxury">
            Do you want to plan highway food stops?
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="food-choice-yes-btn"
              onClick={() => onChooseWantsFood(true)}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsFood === true
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] text-white scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <div className="text-2xl">🍽️</div>
              <div className="text-base font-bold font-serif-luxury">YES, Add Food Stops</div>
              <div className="text-xs text-zinc-400 font-mono-tech">Dhabas & highway diners</div>
            </button>

            <button
              type="button"
              id="food-choice-no-btn"
              onClick={() => onChooseWantsFood(false)}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                wantsFood === false
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] text-white scale-[1.02]'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              <div className="text-2xl">⚡</div>
              <div className="text-base font-bold font-serif-luxury">NO Food Stops</div>
              <div className="text-xs text-zinc-400 font-mono-tech">Non-stop direct drive (₹0)</div>
            </button>
          </div>
        </div>

        {/* If YES: Show Food Stops & Menu Items Selection */}
        {wantsFood === true && (
          <div className="space-y-8 animate-fade-in mb-8">
            
            {/* Number of People Banner & Food Calculation Info */}
            <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono-tech text-zinc-400">Meal Calculation Target:</div>
                  <div className="text-sm sm:text-base font-bold font-serif-luxury text-white">
                    Calculating for <span className="text-[#D4AF37]">{peopleLabel}</span>
                  </div>
                </div>
              </div>

              {onUpdatePeopleCount && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tech text-zinc-400">Change People:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => onUpdatePeopleCount(num)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech transition-all cursor-pointer ${
                          peopleCount === num
                            ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Food Cart / Itemized Subtotal List */}
            {selectedFoodItems.length > 0 && (
              <div className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/40 bg-[#0D0D12]/95 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-serif-luxury text-white">Selected Food Items</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono-tech">
                      {selectedFoodItems.length} Item(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono-tech text-zinc-400 block">Food Subtotal</span>
                    <span className="text-lg font-bold font-serif-luxury text-[#D4AF37]">
                      {formatINR(foodSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 divide-y divide-zinc-800/60">
                  {selectedFoodItems.map((item) => {
                    const itemTotal = item.pricePerPerson * peopleCount * (item.quantity || 1);
                    return (
                      <div key={item.id} className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tech">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="font-semibold text-white text-sm">{item.name}</span>
                            {item.restaurantName && (
                              <span className="text-zinc-500 text-[11px]">at {item.restaurantName}</span>
                            )}
                          </div>
                          <div className="text-zinc-400 text-[11px] mt-0.5">
                            {formatINR(item.pricePerPerson)} per person × {peopleLabel}
                            {item.quantity > 1 ? ` × ${item.quantity} servings` : ''}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-2 py-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-white px-1 text-xs">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateItemQuantity(item.id, (item.quantity || 1) + 1)}
                              className="text-zinc-400 hover:text-white cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-bold text-[#D4AF37] text-sm min-w-[70px] text-right">
                            {formatINR(itemTotal)}
                          </span>

                          <button
                            type="button"
                            onClick={() => onRemoveFoodItem(item.id)}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                            title="Remove food item"
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

            {/* Restaurant Cards & Detailed Menus */}
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
                    className={`rounded-2xl overflow-hidden bg-[#0D0D12] border transition-all duration-300 flex flex-col justify-between ${
                      isSelectedStop
                        ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)]'
                        : 'border-zinc-800 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Image & Header */}
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={stop.image}
                        alt={stop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-black/50" />

                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 text-amber-400 text-xs font-mono-tech border border-zinc-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{stop.rating}</span>
                      </div>

                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#09090D]/90 border border-zinc-700 text-[#F3E5AB] text-[10px] font-mono-tech">
                        {stop.type || 'Highway Diner'}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-lg font-bold font-serif-luxury text-white">
                            {stop.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{stop.location}</span>
                        </div>

                        {/* Cuisine & Contact */}
                        <div className="text-xs text-zinc-400 font-mono-tech mb-2">
                          <span className="text-[#D4AF37]">Cuisine:</span> {stop.cuisine}
                        </div>

                        <div className="mb-4 text-xs font-mono-tech text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{stop.contact ? `Contact: ${stop.contact}` : 'Highway Location'}</span>
                        </div>

                        {/* Menu Items with Per-Person Pricing */}
                        <div className="mt-4 pt-3 border-t border-zinc-800">
                          <div className="text-xs font-mono-tech uppercase font-bold text-[#F3E5AB] mb-2.5 flex items-center justify-between">
                            <span>Available Food Items</span>
                            <span className="text-[10px] text-zinc-400 font-normal">Price per person</span>
                          </div>

                          <div className="space-y-2">
                            {stopMenuItems.map((menuItem) => {
                              const alreadySelected = selectedFoodItems.find(
                                (item) => item.foodItemId === menuItem.id && item.restaurantId === stop.id
                              );

                              return (
                                <div
                                  key={menuItem.id}
                                  className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-xs font-mono-tech hover:border-zinc-700 transition-all"
                                >
                                  <div className="flex items-center gap-2 flex-1 pr-2">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${menuItem.isVeg ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                    <div>
                                      <div className="text-white font-medium">{menuItem.name}</div>
                                      <div className="text-xs text-[#D4AF37] font-semibold">
                                        {formatINR(menuItem.pricePerPerson)} per person
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    {alreadySelected ? (
                                      <div className="flex items-center gap-1.5">
                                        <div className="flex items-center gap-1 bg-zinc-800 px-1.5 py-0.5 rounded-lg">
                                          <button
                                            type="button"
                                            onClick={() => onUpdateItemQuantity(alreadySelected.id, Math.max(1, (alreadySelected.quantity || 1) - 1))}
                                            className="text-zinc-400 hover:text-white px-1 cursor-pointer"
                                          >
                                            -
                                          </button>
                                          <span className="text-white font-bold">{alreadySelected.quantity || 1}</span>
                                          <button
                                            type="button"
                                            onClick={() => onUpdateItemQuantity(alreadySelected.id, (alreadySelected.quantity || 1) + 1)}
                                            className="text-zinc-400 hover:text-white px-1 cursor-pointer"
                                          >
                                            +
                                          </button>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => onRemoveFoodItem(alreadySelected.id)}
                                          className="p-1 rounded bg-zinc-800 hover:bg-red-900 text-zinc-400 hover:text-red-300 cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!isSelectedStop) {
                                            onToggleFoodStop(stop);
                                          }
                                          onAddFoodItem(menuItem, stop);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-[#D4AF37] text-zinc-300 hover:text-black font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
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

                      {/* Card Footer */}
                      <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                        <div className="text-[11px] font-mono-tech text-zinc-400">
                          {stop.estimatedStopover} stopover
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleFoodStop(stop)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-tech uppercase font-bold tracking-wider transition-all cursor-pointer ${
                            isSelectedStop
                              ? 'gold-gradient-bg text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
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

        {/* Step Completion & Action Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-tech uppercase tracking-wider cursor-pointer"
          >
            ← Back to Step 3: Hotel
          </button>

          {isComplete ? (
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="hidden md:flex items-center gap-2 text-emerald-400 text-xs font-mono-tech font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Step 4 completed: {wantsFood ? `${selectedFoodItems.length} food item(s) selected (${formatINR(foodSubtotal)})` : 'Non-stop direct drive (₹0)'}
                </span>
              </div>
              <button
                type="button"
                id="step-4-next-btn"
                onClick={onContinue}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 gold-gradient-bg text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-mono-tech text-amber-400">
              Please choose YES or NO for food stops above
            </span>
          )}
        </div>

      </div>
    </section>
  );
};

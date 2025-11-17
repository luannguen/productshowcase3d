import React, { useMemo } from 'react';
import { Product, CartItem, WishlistItem, RecentlyViewedItem } from '../types';
import GridView from './GridView';
import { UserIcon } from './icons';

interface ForYouViewProps extends Omit<React.ComponentProps<typeof GridView>, 'products'> {
  allProducts: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: RecentlyViewedItem[];
}

const ForYouView: React.FC<ForYouViewProps> = (props) => {
  const { allProducts, cart, wishlist, recentlyViewed, ...rest } = props;

  const recommendedProducts = useMemo(() => {
    const interactionScores: { [id: number]: number } = {};
    const categoryScores: { [category: string]: number } = {};

    // Score products based on interactions
    recentlyViewed.forEach(p => { interactionScores[p.id] = (interactionScores[p.id] || 0) + 1; });
    wishlist.forEach(p => { interactionScores[p.id] = (interactionScores[p.id] || 0) + 2; });
    cart.forEach(item => { interactionScores[item.product.id] = (interactionScores[item.product.id] || 0) + 3; });

    // Score categories based on interacted products
    allProducts.forEach(p => {
      if (interactionScores[p.id]) {
        categoryScores[p.category] = (categoryScores[p.category] || 0) + interactionScores[p.id];
      }
    });

    const interactedProductIds = new Set(Object.keys(interactionScores).map(Number));

    // Filter and sort products
    const recommendations = allProducts
      .filter(p => !interactedProductIds.has(p.id)) // Exclude already interacted products
      .map(p => ({
        product: p,
        score: categoryScores[p.category] || 0, // Score based on category
      }))
      .sort((a, b) => b.score - a.score) // Sort by score
      .slice(0, 12) // Limit to top 12 recommendations
      .map(item => item.product);
      
    // If no recommendations, show best sellers
    if (recommendations.length === 0) {
        return allProducts.filter(p => p.tags?.includes('Best Seller')).slice(0, 8);
    }
    
    return recommendations;

  }, [allProducts, cart, wishlist, recentlyViewed]);

  return (
    <div>
        <div className="mb-8 p-6 bg-gradient-to-r from-[var(--background-secondary)] to-transparent rounded-[var(--border-radius)]">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <UserIcon className="w-8 h-8 text-[var(--primary-accent)]"/>
                Just For You
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
                Products we've picked based on your recent activity.
            </p>
        </div>
        {recommendedProducts.length > 0 ? (
            <GridView products={recommendedProducts} {...rest} />
        ) : (
            <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
                <h2 className="text-2xl font-bold">Nothing to recommend yet!</h2>
                <p className="mt-2 text-[var(--text-secondary)]">Start browsing to get personalized recommendations.</p>
            </div>
        )}
    </div>
  );
};

export default ForYouView;

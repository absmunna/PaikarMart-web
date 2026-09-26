import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingDisplay } from "@/features/product/components/RatingDisplay";
import { Clock, MapPin, CheckCircle } from "lucide-react";

interface ServiceCardProps {
  title: string;
  provider: string;
  image: string;
  price: number;
  priceUnit?: string;
  rating: number;
  reviews: number;
  duration?: string;
  location?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  badge?: string;
  onBook?: () => void;
}

export function ServiceCard({
  title,
  provider,
  image,
  price,
  priceUnit = "service",
  rating,
  reviews,
  duration,
  location,
  isVerified = false,
  isAvailable = true,
  badge,
  onBook,
}: ServiceCardProps) {
  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {badge && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {badge}
          </Badge>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white text-foreground">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="line-clamp-2 min-h-[2.5rem]">{title}</h3>

        {/* Provider */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{provider}</span>
          {isVerified && (
            <CheckCircle className="w-4 h-4 text-verified fill-current" />
          )}
        </div>

        {/* Rating */}
        <RatingDisplay rating={rating} count={reviews} />

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <span className="text-xl text-price">${price}</span>
            <span className="text-sm text-muted-foreground">/{priceUnit}</span>
          </div>

          <Button onClick={onBook} disabled={!isAvailable} size="sm">
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
}

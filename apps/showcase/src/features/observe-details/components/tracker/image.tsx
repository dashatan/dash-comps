type ObserveImageModalProps = {
  index?: number;
};

export default function ObserveImageModal({ index }: ObserveImageModalProps) {
  return (
    <span className="text-muted-foreground text-xs">
      {index != null ? `Image #${index + 1}` : "Image"}
    </span>
  );
}

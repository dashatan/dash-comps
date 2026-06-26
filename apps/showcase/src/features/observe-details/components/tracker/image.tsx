type ObserveImageModalProps = {
  index?: number;
};

export default function ObserveImageModal({ index }: ObserveImageModalProps) {
  return (
    <span className="text-xs text-muted-foreground">
      {index != null ? `Image #${index + 1}` : "Image"}
    </span>
  );
}

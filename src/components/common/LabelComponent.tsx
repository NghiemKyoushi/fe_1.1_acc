import { LabelHTMLAttributes, forwardRef } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import styled from "styled-components";
export interface LabeComponentProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  require?: boolean;
}
interface Props {
  label?: string;
}

export const LabelComponent = forwardRef<HTMLLabelElement, LabeComponentProps>(
  (props, ref) => {
    return (
      <label
        style={{ position: "relative" }}
        ref={ref as React.ForwardedRef<HTMLLabelElement>}
      >
        {props.children}
        {props.require && (
          <span
            style={{
              color: "red",
              position: "absolute",
              top: 0,
            }}
          >
            *
          </span>
        )}
      </label>
    );
  }
);
LabelComponent.displayName = "LabelComponent";

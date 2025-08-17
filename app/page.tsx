"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ReactNode, useState } from "react";
import { z } from "zod";

const FormSchema = z.object({
  pizzaSize: z.number().min(1, "Pizza size must be at least 1 inch"),
  pizzaCost: z.number().min(0, "Pizza cost must be at least $0"),
  caresAboutCrust: z.boolean(),
  crustSize: z.number().min(0, "Crust size must be at least 0"),
});

interface PizzaResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  percentOfPizzaIsCrust: ReactNode;
  pricePerSquareInchWithoutCrust: ReactNode;
  payForCrust: ReactNode;
  pricePerSquareInch: ReactNode;
}

export default function Pizza() {
  const [responseData, setResponseData] = useState<PizzaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pizzaSize: 0,
      pizzaCost: 0,
      caresAboutCrust: false,
      crustSize: 0,
    },
  });

  const caresAboutCrust = form.watch("caresAboutCrust");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const response = await fetch("/api/pizza", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pizzaSize: data.pizzaSize,
        pizzaCost: data.pizzaCost,
        ...(data.caresAboutCrust && { crustSize: data.crustSize }),
      }),
    });
    const responseData = await response.json();
    setResponseData(responseData);
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col">
        <div>
          <p className="font-bold text-2xl font-[Gosha] lowercase pb-1">APUD</p>
          <p className="text-gray-500 text-sm">
            A small, simple tool to calculate the price of pizza by the square
            inch.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-5 flex flex-col space-y-3"
          >
            <FormField
              control={form.control}
              name="pizzaSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pizza Size (diameter in inches)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 12"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pizzaCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pizza Cost ($)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 15.99"
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caresAboutCrust"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>I care about the crust</FormLabel>
                </FormItem>
              )}
            />

            {caresAboutCrust && (
              <FormField
                control={form.control}
                name="crustSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crust Size (thickness in inches)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 1"
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit">Calculate</Button>
            <div className="pb-1" />
            {responseData && responseData.data && (
              <div>
                <h2>Results</h2>
                <div>
                  Price per square inch: $
                  {Number(responseData.data.pricePerSquareInch).toFixed(2)}
                </div>
                {caresAboutCrust && (
                  <>
                    <div>
                      Price per square inch (excluding crust): $
                      {Number(
                        responseData.data.pricePerSquareInchWithoutCrust,
                      ).toFixed(2)}
                    </div>
                    <div>
                      Percent of pizza that is crust:{" "}
                      {Number(responseData.data.percentOfPizzaIsCrust).toFixed(
                        2,
                      )}
                      %
                    </div>
                    <div>
                      Amount paid for crust: $
                      {Number(responseData.data.payForCrust).toFixed(2)}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

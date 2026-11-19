"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { INDIAN_STATES } from "@teziko/data/states";
import type { Address, CustomerProfile, SessionUser } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import { Input, NativeSelect } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { StateBlock } from "@teziko/ui/components/states";
import { toast } from "@teziko/ui/components/toaster";
import {
  addressSchema,
  profileSchema,
  type AddressInput,
  type ProfileInput,
} from "@teziko/validators";
import { MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getDataAdapter } from "../data-access";

export function ProfilePanel({ user }: { user: SessionUser }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  useEffect(() => {
    let alive = true;
    getDataAdapter()
      .getProfile(user.email)
      .then((p) => {
        if (!alive) return;
        setProfile(
          p ?? {
            email: user.email,
            name: user.name,
            phone: "",
            addresses: [],
            createdAt: new Date().toISOString(),
          },
        );
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [user.email, user.name]);

  async function save(next: CustomerProfile, message: string) {
    await getDataAdapter().saveProfile(next);
    setProfile(next);
    toast.success(message);
  }

  if (status === "loading")
    return (
      <div className="skeleton h-72 rounded-2xl" aria-busy="true" aria-label="Loading profile" />
    );
  if (status === "error" || !profile)
    return (
      <StateBlock
        icon={MapPinIcon}
        tone="error"
        title="Couldn't load your profile"
        description="Please refresh to try again."
      />
    );

  return (
    <div className="grid gap-10">
      <section aria-labelledby="profile-h" className="border-border rounded-2xl border p-5 sm:p-6">
        <h2 id="profile-h" className="font-sans text-lg font-semibold tracking-normal">
          Profile
        </h2>
        <ProfileForm
          profile={profile}
          onSave={(v) => save({ ...profile, ...v }, "Profile saved")}
        />
      </section>

      <section aria-labelledby="addr-h">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="addr-h" className="font-sans text-lg font-semibold tracking-normal">
            Saved addresses
          </h2>
          <Button size="sm" variant="outline" onClick={() => setEditing("new")}>
            <PlusIcon aria-hidden="true" /> Add address
          </Button>
        </div>
        {profile.addresses.length === 0 ? (
          <StateBlock
            icon={MapPinIcon}
            title="No saved addresses"
            description="Add one to check out faster."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {profile.addresses.map((a) => (
                <m.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="border-border rounded-2xl border p-5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{a.label}</p>
                    {a.isDefault ? <Badge variant="muted">Default</Badge> : null}
                  </div>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {a.fullName} · {a.phone}
                    <br />
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}, {a.state} {a.pincode}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(a)}>
                      <PencilIcon aria-hidden="true" /> Edit
                    </Button>
                    {!a.isDefault ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          save(
                            {
                              ...profile,
                              addresses: profile.addresses.map((x) => ({
                                ...x,
                                isDefault: x.id === a.id,
                              })),
                            },
                            "Default address updated",
                          )
                        }
                      >
                        Make default
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete address ${a.label}`}
                      onClick={() => {
                        const rest = profile.addresses.filter((x) => x.id !== a.id);
                        if (a.isDefault && rest[0]) rest[0] = { ...rest[0], isDefault: true };
                        void save({ ...profile, addresses: rest }, "Address removed");
                      }}
                    >
                      <Trash2Icon aria-hidden="true" /> Delete
                    </Button>
                  </div>
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <AddressDialog
        address={editing === "new" ? null : editing}
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        onSave={async (values) => {
          const isNew = editing === "new";
          const id = isNew ? crypto.randomUUID() : (editing as Address).id;
          const base: Address = {
            id,
            isDefault: isNew ? profile.addresses.length === 0 : (editing as Address).isDefault,
            ...values,
            line2: values.line2 || undefined,
          };
          const addresses = isNew
            ? [...profile.addresses, base]
            : profile.addresses.map((x) => (x.id === id ? base : x));
          await save({ ...profile, addresses }, isNew ? "Address added" : "Address updated");
          setEditing(null);
        }}
      />
    </div>
  );
}

function ProfileForm({
  profile,
  onSave,
}: {
  profile: CustomerProfile;
  onSave: (v: ProfileInput) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, phone: profile.phone },
  });
  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        await onSave(v);
        reset(v);
      })}
      noValidate
      className="mt-5 grid gap-5 sm:grid-cols-2"
    >
      <Field id="pf-name" label="Full name" error={errors.name?.message} required>
        <Input
          id="pf-name"
          autoComplete="name"
          {...register("name")}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy("pf-name", errors.name?.message)}
        />
      </Field>
      <Field id="pf-phone" label="Mobile number" error={errors.phone?.message} hint="Optional">
        <Input
          id="pf-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          {...register("phone")}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("pf-phone", errors.phone?.message, "Optional")}
        />
      </Field>
      <Field id="pf-email" label="Email" hint="Email can't be changed in the demo.">
        <Input
          id="pf-email"
          value={profile.email}
          readOnly
          aria-describedby="pf-email-hint"
          className="bg-muted"
        />
      </Field>
      <div className="flex items-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function AddressDialog({
  address,
  open,
  onOpenChange,
  onSave,
}: {
  address: Address | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (v: AddressInput) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    values: address
      ? {
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2 ?? "",
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        }
      : {
          label: "Home",
          fullName: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          pincode: "",
        },
  });
  const f = (
    name: keyof AddressInput,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
    required = true,
  ) => (
    <Field id={`ad-${name}`} label={label} error={errors[name]?.message} required={required}>
      <Input
        id={`ad-${name}`}
        {...register(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={describedBy(`ad-${name}`, errors[name]?.message)}
        {...props}
      />
    </Field>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add address"}</DialogTitle>
          <DialogDescription>
            Stored for this demo only and deleted after 14 days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} noValidate className="grid gap-4 sm:grid-cols-2">
          {f("label", "Label (e.g. Home, Office)")}
          {f("fullName", "Full name", { autoComplete: "name" })}
          {f("phone", "Mobile number", { type: "tel", inputMode: "numeric", maxLength: 10 })}
          {f("pincode", "PIN code", { inputMode: "numeric", maxLength: 6 })}
          <div className="sm:col-span-2">{f("line1", "House no., building, street")}</div>
          <div className="sm:col-span-2">{f("line2", "Area, landmark (optional)", {}, false)}</div>
          {f("city", "City")}
          <Field id="ad-state" label="State" error={errors.state?.message} required>
            <NativeSelect
              id="ad-state"
              {...register("state")}
              aria-invalid={Boolean(errors.state)}
              aria-describedby={describedBy("ad-state", errors.state?.message)}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Button type="submit" disabled={isSubmitting} className="sm:col-span-2">
            Save address
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Seed default permissions and assign them to roles.
 *
 * Run with:
 *   npx ts-node --project tsconfig.json -e "require('./prisma/seed-permissions.ts')"
 * or:
 *   npx ts-node prisma/seed-permissions.ts
 */

import { prisma } from "../src/lib/prisma";
import { Role } from "@prisma/client";

// ─── Permission matrix ───────────────────────────────────────────────────────

const PERMISSIONS: { resource: string; action: string; description?: string }[] = [
  // users
  { resource: "users", action: "create",  description: "Create a new user account" },
  { resource: "users", action: "read",    description: "View user list and profiles" },
  { resource: "users", action: "update",  description: "Edit user details / roles" },
  { resource: "users", action: "delete",  description: "Delete a user account" },

  // roles
  { resource: "roles", action: "read",    description: "View role assignments" },
  { resource: "roles", action: "update",  description: "Change user role assignments" },

  // entries
  { resource: "entries", action: "create", description: "Submit a new form entry" },
  { resource: "entries", action: "read",   description: "View form entries" },
  { resource: "entries", action: "update", description: "Edit a form entry" },
  { resource: "entries", action: "delete", description: "Delete a form entry" },
  { resource: "entries", action: "export", description: "Export entries to CSV / Excel" },

  // stats
  { resource: "stats", action: "read",    description: "View dashboard statistics" },

  // constituencies
  { resource: "constituencies", action: "create", description: "Add a new constituency" },
  { resource: "constituencies", action: "read",   description: "View constituencies" },
  { resource: "constituencies", action: "update", description: "Edit a constituency" },
  { resource: "constituencies", action: "delete", description: "Remove a constituency" },

  // postings
  { resource: "postings", action: "create", description: "Add a constituency posting" },
  { resource: "postings", action: "read",   description: "View constituency postings" },
  { resource: "postings", action: "update", description: "Edit a constituency posting" },
  { resource: "postings", action: "delete", description: "Remove a constituency posting" },

  // permissions
  { resource: "permissions", action: "read",   description: "View permission assignments" },
  { resource: "permissions", action: "update", description: "Grant / revoke permissions" },
];

// ─── Role assignment rules ───────────────────────────────────────────────────

/** Returns true if this permission should be granted to the given role. */
function isGranted(role: Role, resource: string, action: string): boolean {
  if (role === Role.SUPER_ADMIN) return true;

  if (role === Role.ADMIN) {
    const adminGrants: Record<string, string[]> = {
      users:          ["read", "update"],
      roles:          ["read"],
      entries:        ["create", "read", "update", "delete", "export"],
      stats:          ["read"],
      constituencies: ["create", "read", "update", "delete"],
      postings:       ["create", "read", "update", "delete"],
    };
    return adminGrants[resource]?.includes(action) ?? false;
  }

  if (role === Role.USER) {
    const userGrants: Record<string, string[]> = {
      entries: ["create", "read"],
    };
    return userGrants[resource]?.includes(action) ?? false;
  }

  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding permissions…");

  // 1. Upsert all permissions
  const upserted = await Promise.all(
    PERMISSIONS.map((p) =>
      prisma.permission.upsert({
        where:  { resource_action: { resource: p.resource, action: p.action } },
        create: { resource: p.resource, action: p.action, description: p.description },
        update: { description: p.description },
      })
    )
  );
  console.log(`  ${upserted.length} permissions upserted.`);

  // 2. Assign permissions to roles
  const roles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.USER];
  let assignCount = 0;

  for (const role of roles) {
    for (const perm of upserted) {
      if (isGranted(role, perm.resource, perm.action)) {
        await prisma.rolePermission.upsert({
          where:  { role_permissionId: { role, permissionId: perm.id } },
          create: { role, permissionId: perm.id },
          update: {},
        });
        assignCount++;
      }
    }
  }

  console.log(`  ${assignCount} role-permission assignments upserted.`);
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

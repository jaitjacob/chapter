import {
  FieldResolver,
  Resolver,
  Mutation,
  Ctx,
  Root,
  Arg,
  Query,
} from 'type-graphql';
import { Prisma } from '@prisma/client';
import {
  User,
  Chapter,
  UserWithInstanceRole,
  UserForDownload,
  UserProfile,
} from '../../graphql-types';
import { prisma } from '../../prisma';
import { ResolverCtx } from '../../common-types/gql';
import {
  isAdminFromInstanceRole,
  isChapterAdminWhere,
} from '../../util/adminedChapters';
import { UpdateUserInputs } from './input';

@Resolver(() => UserWithInstanceRole)
export class UserWithPermissionsResolver {
  @FieldResolver(() => [Chapter])
  async admined_chapters(
    @Root() user: UserWithInstanceRole,
  ): Promise<Chapter[]> {
    return await prisma.chapters.findMany({
      ...(!isAdminFromInstanceRole(user) && {
        where: isChapterAdminWhere(user.id),
      }),
    });
  }

  @Query(() => UserProfile, { nullable: true })
  async userProfile(@Ctx() ctx: ResolverCtx): Promise<UserProfile | null> {
    if (!ctx.user) return null;
    return await prisma.users.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        instance_role: {
          include: {
            instance_role_permissions: {
              include: { instance_permission: true },
            },
          },
        },
      },
    });
  }

  @Query(() => UserForDownload, { nullable: true })
  async userDownload(@Ctx() ctx: ResolverCtx): Promise<UserForDownload | null> {
    if (!ctx.user) return null;
    return await prisma.users.findUnique({
      where: {
        id: ctx.user.id,
      },
      include: {
        user_chapters: {
          include: {
            chapter_role: {
              include: {
                chapter_role_permissions: {
                  include: { chapter_permission: true },
                },
              },
            },
            chapter: true,
          },
        },
        instance_role: {
          include: {
            instance_role_permissions: {
              include: { instance_permission: true },
            },
          },
        },
        user_bans: {
          include: {
            chapter: true,
          },
        },
        user_events: {
          include: {
            rsvp: true,
            event_role: {
              include: {
                event_role_permissions: {
                  include: { event_permission: true },
                },
              },
            },
            event: true,
          },
        },
      },
    });
  }

  @Mutation(() => User)
  async toggleAutoSubscribe(@Ctx() ctx: Required<ResolverCtx>): Promise<User> {
    return await prisma.users.update({
      data: { auto_subscribe: !ctx.user.auto_subscribe },
      where: { id: ctx.user.id },
    });
  }

  @Mutation(() => User)
  async updateMe(
    @Ctx() ctx: Required<ResolverCtx>,
    @Arg('data') data: UpdateUserInputs,
  ): Promise<User | undefined> {
    const UserData: Prisma.usersUpdateInput = data;
    return await prisma.users.update({
      where: { id: ctx.user.id },
      data: UserData,
    });
  }

  @Mutation(() => User)
  async deleteMe(@Ctx() ctx: Required<ResolverCtx>): Promise<User | undefined> {
    return await prisma.users.delete({ where: { id: ctx.user.id } });
  }
}

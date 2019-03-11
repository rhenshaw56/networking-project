const { User } = require('../models/user');
const { Stage } = require('../models/stages');
const { Benefits } = require('../models/parent_benefits');


class UserService {
  constructor() {
    this.User = User;
    this.referalId = null;
  }

  async getParents(childId, parents = []) {
    try {
      const parentId = await UserController.getParent(childId);
      if (parentId === null) {
        return parents;
      } else {
        parents.push(parentId);
        return await UserController.getParents(parentId, parents);
      }
    } catch(e) {
      console.log('ttt', e);
    }
  }

  async trasverseTreeAndAssignBonus(childId) {
    try {
      const parentId = await UserController.getParent(childId);
      if (parentId === null) {
        await UserController.updateStage(parentId);
        return;
      } else {
        await UserController.updateStage(parentId);
        return await UserController.trasverseTreeAndAssignBonus(parentId);
      }
    } catch(e) {
      console.log('lll', e);
    }
  }

  async getAncestor(childId) {
    try {
      const parentId = await UserController.getParent(childId);
      if (parentId === null) {
        return childId;
      } else {
        return await UserController.getAncestor(parentId);
      }
    } catch(e) {
      console.log('lll', e);
    }
  }

  async getReferalTree (parentId, nextGeneration = [], tree = []) {
    if (tree.indexOf(parentId) < 0) {
      tree.push(parentId);
    }

    try {
      const children = await UserController.getChildren(parentId);
      
      if (children.length > 0) {

        const newTree = tree.concat(children);
        const parentIndex = newTree.indexOf(parentId);
        if (parentId > 0) {
          return await UserController.getReferalTree(
            newTree[parentIndex + 1],
            newTree[parentIndex + 2],
            newTree
          );
        }
        return newTree;
      } else {
        return tree;
      }
      
    } catch(e) {
      console.log('hhh', e);
    } 
  }

  async getParent(childId) {
    try {
      const child = await User.query().findById(childId);
      if (childId) {
        return child.parent_id;
      }
    } catch(e) {
      console.log('e', e);
    }
  }

  async getChildren(parentId) {
    let childIds = [];
    try {
      const children = await User.query().where('parent_id', '=', parentId);
      if (children.length) {
        children.forEach((child) => {
          childIds.push(child.id);
        })
        return childIds;
      }
      return childIds;
    } catch(e) {
      console.log('eee', e);
    }
  }

  async removeParent(parentId) {
    try {
      // find all children and set their parent_id vvalues to null
      const children = await User.query()
          .patch({
            parent_id: null
          })
          .where('parent_id', '=', parentId)
          .returning('*');

      return children;

    } catch(e) {
      console.log('eerrr', e);
    }

  }

  async getReferalSlot(parentId, next = null) {
    try {
        // proceed to compute referal slot
        // check if available slots in parent is complete
        const parentSlots = await UserController.getChildren(parentId);

        if (parentSlots.length < 2) {
          // grant bonus based on stage
          return parentId;
        } else {
          if (!next) {
            next = parentSlots[1]
            parentId = parentSlots[0]
          } else {
            parentId = next;
            next = parentSlots[0]
          }

          // get the position of the parent
          // increase stage of current parent and compute bonus

          // make new parent to be next available slot
          return await UserController.getReferalSlot(
            parentId,
            next
          );
        }
    } catch (e) {
      console.log('ee', e);
    }
  }

  async updateBonus (id, amount, newStage) {
    try {
      const user = await User.query().findById(id);
      const bonus = user.bonus + amount;
      await User.query()
          .patch({ bonus, stages_id: newStage })
          .where('id', '=', id)
          .returning('*');
      return await Benefits.query().insert({
        parent_id: id,
        amount
      });
    } catch (e) {
      console.log('oooo', e)
    }
  }

  async saveUser(req, res) {
    const {
      userName,
      referalId = null,
    } = req.body;

    let referer = null;
    let user;
    
    try {
      // ensure referer exists
        referer =  await User.query().findById(referalId);
        // get slot placement
        
        if (referer) {
          const slot = await UserController.getReferalSlot(referalId);
          // check stage of all related parents and compute their bonuses
          // referer exist: save the new user with the parent_id as that of the referer's
          await UserController.updateBonus(slot, 100);
          
          user = await User.query().insert({
            username: userName,
            parent_id: slot,
            stages_id: 1
          });
          await UserController.trasverseTreeAndAssignBonus(user.id);
        } else {
          // if no referer, just save the user
          user = await User.query().insert({
            username: userName,
            stages_id: 1
          });
      }
      return res.status(201).json({ data: user});
    } catch(e) {
      console.log('e', e);
    }
  }

  async updateStage(id) {
    try {
      const user = await User.query().findById(id);
      if (user) {
        const currentStage = user.stages_id;
        const referalTree = await UserController.getReferalTree(id);
        const children = referalTree.slice(1);
        const numberOfChildren = children.length;
        const isElligibleForReward = numberOfChildren === 2 && currentStage === 1
          || numberOfChildren % 6 === 0 && currentStage === 2
          || numberOfChildren % 14 === 0 && currentStage === 3
          || numberOfChildren % 30 === 0 && currentStage === 4
          || numberOfChildren % 62 === 0 && currentStage === 5;
        if (isElligibleForReward) {
          // update stage and give reward
          const stage = await Stage.query().findById(currentStage);
          return await UserController.updateBonus(id, stage.reward, currentStage + 1);
        }
        if (numberOfChildren % 126 === 0 && currentStage.id === 6) {
          // at stage 6 just give user 1000k every time 126 new users are added to the tree
          const stage = await Stage.query().findById(6);
          return await UserController.updateBonus(id, stage.reward, 6);
        }
        return;
      }
    } catch(e) {
      console.log('hhh', e);
    }

  }

  async getUser(req, res) {
    const {
      id
    } = req.body;
    console.log('req.body', req.body);

    try {
      const user = await User.query().findById(id);
      const y = await UserController.updateStage(id);
      if (user) {
        const parents = await UserController.getParents(id);
        console.log('parennts', parents);
        return res.status(200).json({
          data: {
            user,
            parents
          }
        })
      }
    } catch(e) {

    }
  }
}

const UserController = new UserService();

module.exports = { UserController };